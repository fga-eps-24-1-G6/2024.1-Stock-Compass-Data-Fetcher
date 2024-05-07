import 'dotenv/config';
import puppeteer, { HTTPResponse, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import fs from "fs";

const baseURL = process.env.SCRAPER_BASE_URL;
const stockListURL = process.env.SCRAPER_LIST_URL;

const scrapeStockList = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(stockListURL);

    const results = await page.$$eval('table tr td', tds => tds
        .filter(td => { if (!td.cellIndex) return td })
        .map(td => { return td.innerText }));

    await browser.close();

    return results;
};

const getCompanyInfo = async (page: Page) => {
    await page.waitForSelector(".basic_info");

    const pageData = await page.evaluate(() => {
        const div = document.querySelector('.basic_info');
        const rows = div.querySelectorAll('table tbody tr');

        const data = {};
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const label = cells[0].innerText;
            const value = cells[1].innerText;

            data[label] = value;
        });

        return data;
    });

    return pageData;
}

const getCompanyIndicators = async (page: Page) => {
    await page.waitForSelector("div[id='table-indicators-company']");

    const data = await page.$$eval(".cell", (items) =>
        items.map((item) => {
            const name = item.querySelector("span.title")?.textContent?.trim();

            let value: string | number;
            let rawValue = item.querySelector("div.detail-value")?.textContent?.trim();
            if (!rawValue) value = item.querySelector("span.value")?.textContent?.trim();
            else value = parseFloat(
                rawValue
                    .replaceAll('\n', '')
                    .replace('R$ ', '')
                    .replace('%', '')
                    .replaceAll('.', '')
                    .replace(',', '.').trim()
            )

            if (name && value) {
                return {
                    name: name.replaceAll('\n', '').trim(),
                    value
                };
            }
        }).filter(Boolean)
    );

    const companyData = {};
    data.forEach(item => companyData[item.name] = item.value);

    return companyData;
}

const getDividendsHistory = async (page: Page) => {
    await page.waitForSelector('.dataTables_paginate');

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

export const scrapeStocks = async () => {
    const stocks = [];
    const tickers = await scrapeStockList();

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 15,
    });

    await cluster.task(async ({ page, data }) => {
        console.log('Procurando ação: ' + data)
        const urls = [];

        const responseHandler = async (response: HTTPResponse) => {
            const url = response.url();

            if (url.includes(`${baseURL}/api`) && !url.includes('component')) {
                urls.push(url);
            }
        };

        page.on('response', responseHandler);

        await page.goto(`${baseURL}/acoes/${data}`, {
            waitUntil: "load",
            timeout: 0,
        });

        const companyData = {
            ... await getCompanyInfo(page),
            ... await getCompanyIndicators(page)
        };

        const dividendHistory = await getDividendsHistory(page);

        await new Promise(resolve => setTimeout(resolve, 3000));

        page.off('response', responseHandler);

        const stockUrl = urls.find(url => url.includes('cotacao/ticker/'));
        const stockId = typeof stockUrl != 'undefined' ? stockUrl.split('cotacao/ticker/')[1] : "";

        const companyUrl = urls.find(url => url.includes('receitaliquida/chart/'));
        const companyId = typeof companyUrl != 'undefined' ? companyUrl.split('receitaliquida/chart/')[1].split('/')[0] : "";

        if (stockId || companyId) {
            stocks.push({
                ticker: data,
                stockId,
                companyId,
                companyData,
                dividendHistory
            });
            console.log('Dados de ' + data + ' adicionados')
        }
        else console.log('Não foram encontrados dados de ' + data)
    });

    for (const ticker of tickers) {
        cluster.queue(ticker);
        console.log('Enfileirou: ' + ticker)
    }

    await cluster.idle();
    await cluster.close();

    const stocksData = JSON.stringify(stocks);

    fs.writeFile("stocks.json", stocksData, (error) => {
        if (error) {
            console.error(error);
            throw error;
        }

        console.log("stocks.json written correctly");
    });
}

scrapeStocks();

// const file = fs.readFileSync("stocks1.json");
// const data = JSON.parse(file)
// console.log(data.length)
