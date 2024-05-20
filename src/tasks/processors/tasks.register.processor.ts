import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { catchError, map } from "rxjs/operators";
import { Observable, forkJoin, lastValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { BalanceSheetRepository } from 'src/balanceSheets/repositories/balanceSheet.repository';
import { CompanyRepository } from 'src/company/repositories/company.repository';
import { DividendRepository } from 'src/dividends/repositories/dividend.repository';
import { PriceRepository } from 'src/prices/repositories/price.repository';
import { StockRepository } from 'src/stocks/repositories/stock.repository';
import { handleCompanyData, handleStockData } from '../handlers/stock.handler';
import { handleDividendsData } from '../handlers/dividend.handler';
import { handleBalanceSheetsData } from '../handlers/balanceSheet.handler';
import { handlePriceHistoryData } from '../handlers/price.handler';

@Processor('register')
export class TasksRegisterProcessor {
    constructor(
        @Inject('StockRepository') private readonly stockRepository: StockRepository,
        @Inject('CompanyRepository') private readonly companyRepository: CompanyRepository,
        @Inject('DividendRepository') private readonly dividendRepository: DividendRepository,
        @Inject('PriceRepository') private readonly priceRepository: PriceRepository,
        @Inject('BalanceSheetRepository') private readonly balanceSheetRepository: BalanceSheetRepository,
        private readonly httpService: HttpService,
    ) { }

    private readonly logger = new Logger(TasksRegisterProcessor.name);

    private makeBatchRequests(urls: string[]): Observable<any[]> {
        const requests: Observable<any>[] = [];

        urls.forEach((url) => {
            requests.push(
                this.httpService.get(url).pipe(
                    map((response) => response.data),
                    catchError((error) => {
                        this.logger.error(error.message);
                        return null;
                    })
                )
            );
        });

        return forkJoin(requests);
    }

    @Process()
    async handleRegisterStockData(job: Job) {
        const stockData = job.data;

        this.logger.debug(`Start registering ${stockData['ticker']}...`);

        // registers company
        let existingCompany = await this.companyRepository.findByName(stockData['companyData']['Nome da Empresa:']);
        if (typeof existingCompany == 'undefined') {
            const createCompanyData = handleCompanyData(stockData);
            existingCompany = await this.companyRepository.create(createCompanyData);
        } else if (!existingCompany.externalId && stockData['companyId']) {
            await this.companyRepository.update(existingCompany.id, { externalId: stockData['companyId'] });
        }

        // registers stock
        let existingStock = await this.stockRepository.findByTicker(stockData['ticker']);
        if (typeof existingStock == 'undefined') {
            existingStock = await this.stockRepository.create(handleStockData(stockData, existingCompany.id));
        }

        const result = await lastValueFrom(this.makeBatchRequests([
            `${process.env.SCRAPER_BASE_URL}/api/balancos/balancoresultados/chart/${existingCompany.externalId}/10/quarterly/`,
            `${process.env.SCRAPER_BASE_URL}/api/balancos/balancopatrimonial/chart/${existingCompany.externalId}/false/`,
            `${process.env.SCRAPER_BASE_URL}/api/cotacoes/acao/chart/${existingStock.ticker.toLowerCase()}/365/true/real/`
        ]));

        // registers balance sheets
        const balanceSheets = handleBalanceSheetsData({
            companyId: existingCompany.id,
            baseData: result[0],
            assetsAndLiabilitiesData: result[1]
        })
        if (balanceSheets) await this.balanceSheetRepository.createMultiple(balanceSheets);

        // registers past prices
        const prices = handlePriceHistoryData(existingStock.id, result[2]);
        if (prices) await this.priceRepository.createMultiple(prices);

        // registers dividends
        const dividends = handleDividendsData(stockData, existingStock.id);
        if (dividends) await this.dividendRepository.createMultiple(dividends);

        this.logger.debug(`${stockData['ticker']} registration completed`);
    }
}