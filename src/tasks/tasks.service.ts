import fs from "fs";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BalanceSheetRepository } from "src/balanceSheets/repositories/balanceSheet.repository";
import { CompanyRepository } from "src/company/repositories/company.repository";
import { DividendRepository } from "src/dividends/repositories/dividend.repository";
import { PriceRepository } from "src/prices/repositories/price.repository";
import { StockRepository } from "src/stocks/repositories/stock.repository";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class TasksService {
    constructor(
        @Inject('StockRepository') private readonly stockRepository: StockRepository,
        @Inject('CompanyRepository') private readonly companyRepository: CompanyRepository,
        @Inject('DividendRepository') private readonly dividendRepository: DividendRepository,
        @Inject('PriceRepository') private readonly priceRepository: PriceRepository,
        @Inject('BalanceSheetRepository') private readonly balanceSheetRepository: BalanceSheetRepository,
        @InjectQueue('register') private readonly registerQueue: Queue,
        @InjectQueue('new_price') private readonly newPriceQueue: Queue,
        @InjectQueue('new_dividends') private readonly newDividendsQueue: Queue,
        @InjectQueue('new_balance_sheets') private readonly newBalanceSheetsQueue: Queue,
    ) { }

    private readonly logger = new Logger(TasksService.name);
    private readonly fetchingEnabled = process.env.FETCHING_UPDATES_ENABLED || false;

    async populate() {
        try {
            // check json exists
            const file = fs.readFileSync("stocks.json");
            const data = JSON.parse(file.toString('utf-8'));

            // delete current data
            this.priceRepository.deleteAll();
            this.dividendRepository.deleteAll();
            this.stockRepository.deleteAll();
            this.balanceSheetRepository.deleteAll();
            this.companyRepository.deleteAll();

            // for each =>
            //      create company if not exists
            //      create stock
            //      fetch old prices
            //      fetch old dividends
            //      featch old balanceSheets

            for (const item of data) {
                await this.registerQueue.add(item, {
                    delay: 200,
                    attempts: 3,
                    timeout: 10000
                });
                this.logger.debug(`Enqued ${item['ticker']}`);
            }

            this.logger.log('Populated application successfully! : )');
        } catch (error) {
            throw new HttpException((error as Error).message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async fetchNewPrices() {
        if (this.fetchingEnabled) {
            this.logger.debug('Fetching new prices');
            const stocksWithPrices = await this.priceRepository.findLatest();

            for (const stock of stocksWithPrices) {
                await this.newPriceQueue.add(stock);
                this.logger.debug(`Enqued ${stock.ticker}`);
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async fetchNewDividends() {
        if (this.fetchingEnabled) {
            this.logger.debug('Fetching new dividends');
            const stocks = await this.dividendRepository.findAllGroupedByStock();
            await this.newDividendsQueue.add(stocks);
        }
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async fetchNewBalanceSheets() {
        if (this.fetchingEnabled) {
            this.logger.debug('Fetching new balance sheets');
            const companies = await this.balanceSheetRepository.findAllGroupedByCompany();

            for (const company of companies) {
                await this.newBalanceSheetsQueue.add(company);
                this.logger.debug(`Enqued ${company.name}`);
            }
        }
    }
}