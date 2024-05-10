import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { formatDate } from 'src/utils/formatter';
import { DividendRepository } from 'src/dividends/repositories/dividend.repository';
import { DividendDrizzleRepository } from 'src/dividends/repositories/dividend.drizzle.repository';
require('dotenv').config();

const baseURL = process.env.SCRAPER_BASE_URL;

@Processor('new_dividends')
export class TasksNewDividendsProcessor {
    constructor(
        @Inject(DividendDrizzleRepository) private readonly dividendRepository: DividendRepository,
    ) { }

    private readonly logger = new Logger(TasksNewDividendsProcessor.name);

    private async getDividendsHistory(page: Page) {
        await page.waitForSelector('.dataTables_paginate', { timeout: 40000 });

        let hasNextButton = true;
        const dividends = [];

        while (hasNextButton) {
            const pageData = await page.evaluate(() => {
                const table = document.querySelector('#table-dividends-history');
                const rows = table.querySelectorAll('tbody tr');

                const values = [];
                rows.forEach((row) => {
                    const cells = row.querySelectorAll('td');
                    const type = cells[0].innerText;
                    const ownershipDate = cells[1].innerText;
                    const paymentDate = cells[2].innerText;
                    const value = parseFloat(cells[3].innerText.trim().replace(',', '.'));

                    const currentYear = new Date().getFullYear();
                    const tenYearsAgo = (currentYear - 11);
                    const reachedLastDecade = parseInt(paymentDate.slice(-4)) <= tenYearsAgo;

                    if (!reachedLastDecade) {
                        values.push({
                            type,
                            ownershipDate,
                            paymentDate,
                            value,
                        });
                    }
                });

                return values;
            });

            dividends.push(...pageData);

            hasNextButton = await page.evaluate(() => {
                const nextButton = document.querySelector('#table-dividends-history_next');
                return !nextButton.classList.contains('disabled');
            });

            if (hasNextButton) {
                const nextButton = await page.$('#table-dividends-history_next');
                await nextButton.click();
            }
        }

        return dividends;
    }

    @Process()
    async handleFetchNewDividends(job: Job) {
        const stocks = job.data;
        const newDividends = [];

        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 15,
            timeout: 40000,
            retryLimit: 3,
            puppeteerOptions: {
                executablePath: '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage', '--shm-size=3gb'],
            }
        });

        await cluster.task(async ({ page, data }) => {
            const stock = data;
            this.logger.debug('Started scraping dividends of ' + stock.ticker)

            try {
                await page.goto(`${baseURL}/acoes/${stock.ticker}`, {
                    waitUntil: "load",
                    timeout: 0,
                });

                const dividendHistory = (await this.getDividendsHistory(page)).map(dividendData => (
                    {
                        ...dividendData,
                        ownershipDate: formatDate(dividendData.ownershipDate),
                        paymentDate: formatDate(dividendData.paymentDate),
                        stockId: stock.stockId
                    }
                ));

                if (dividendHistory) {
                    const newStockDividends = dividendHistory.filter(dividend => {
                        if(!dividend.value || !dividend.paymentDate || !dividend.ownershipDate) return false;
                        if (!stock.dividends.length) return true;

                        return !stock.dividends.some((e: { value: string, date: string, type: string }) =>
                            e.value == dividend.value.toString() &&
                            e.date == dividend.paymentDate &&
                            e.type == dividend.type
                        )
                    })

                    if (newStockDividends.length > 0) {
                        newDividends.push(...newStockDividends);
                        this.logger.debug('New dividends of ' + stock.ticker + ' added successfully');
                    } else this.logger.debug('Found no new dividends of ' + stock.ticker);
                }
                else this.logger.debug('Could not find data from stock ' + stock.ticker)
            } catch (error) {
                this.logger.error(error.message)
            }
        });

        for (let i = 0; i < stocks.length; i++) {
            cluster.queue(stocks[i]);
            this.logger.debug('Enfileirou: ' + stocks[i].ticker)
        }

        await cluster.idle();
        await cluster.close();

        console.log(newDividends);
        // if (newDividends.length > 0) {
        //     this.dividendRepository.createMultiple(newDividends);
        // }

        this.logger.debug('Finished scraping new dividends!');
    }
}
