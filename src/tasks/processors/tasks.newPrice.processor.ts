import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { catchError, map } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { PriceDrizzleRepository } from 'src/prices/repositories/price.drizzle.repository';
import { PriceRepository } from 'src/prices/repositories/price.repository';
import { handleNewPriceData } from '../handlers/price.handler';

@Processor('new_price')
export class TasksNewPriceProcessor {
    constructor(
        @Inject(PriceDrizzleRepository) private readonly priceRepository: PriceRepository,
        private readonly httpService: HttpService,
    ) { }

    private readonly logger = new Logger(TasksNewPriceProcessor.name);

    @Process()
    async handleFetchNewPrices(job: Job) {
        const stock = job.data;

        this.logger.debug(`Start fetching price of ${stock.ticker}...`);

        const url = `${process.env.SCRAPER_BASE_URL}/api/cotacao/ticker/${stock['externalid']}`

        const response = this.httpService.get(url).pipe(
            map((response) => response.data),
            catchError((error) => {
                this.logger.error(error.message);
                return null;
            })
        )

        const priceData = await lastValueFrom(response);
        if(!priceData){
            this.logger.warn(`Stock ${stock.ticker} price fetch returned null`);
            return;
        }

        
        const newPrice = handleNewPriceData(stock['stockid'], priceData);
        if(!newPrice){
            this.logger.error(`Fail to create new price for stock ${stock.ticker}`);
            return;
        }

        const lastPriceDate = new Date(stock['latestdate']);
        const newPriceDate = new Date(newPrice.priceDate);
        if(lastPriceDate >= newPriceDate){
            this.logger.debug(`Found no new prices for stock ${stock.ticker}`);
            return;
        }

        await this.priceRepository.create(newPrice);

        this.logger.debug(`${stock.ticker} fetching completed`);
    }
}