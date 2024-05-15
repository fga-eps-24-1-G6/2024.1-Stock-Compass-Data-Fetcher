import { Inject, Injectable } from '@nestjs/common';
import { StockRepository } from './repositories/stock.repository';
import { Stock } from './stock.interface';
import { CreateStockDto, GetStockDto, UpdateStockDto } from './stocks.dtos';

@Injectable()
export class StocksService {
    constructor(
        @Inject('StockRepository') private readonly stockRepository
    ) { }

    async getStock(id: string): Promise<GetStockDto | undefined> {
        const stock = await this.stockRepository.findOne(parseInt(id));
        const stockDto: GetStockDto = {
            ticker: stock.ticker,
            freeFloat: stock.freeFloat,
            tagAlong: stock.tagAlong,
            avgDailyLiquidity: stock.avgDailyLiquidity,
            companyId: stock.companyId
        };
        return stockDto;
    }

    async getAllStocks(): Promise<GetStockDto[] | undefined> {
        const stocks = await this.stockRepository.findAll();
        const stockDtos = stocks.map(stock => ({
            ticker: stock.ticker,
            freeFloat: stock.freeFloat,
            tagAlong: stock.tagAlong,
            avgDailyLiquidity: stock.avgDailyLiquidity,
            companyId: stock.companyId
        }))
        return stockDtos;
    }

    async createStock(createStockDto: CreateStockDto): Promise<Stock | undefined> {
        return await this.stockRepository.create(createStockDto);
    }

    async updateStock(id: string, updateStockDto: UpdateStockDto): Promise<Stock | undefined> {
        return await this.stockRepository.update(parseInt(id), updateStockDto);
    }

    async deleteStock(id: string) {
        await this.stockRepository.delete(parseInt(id));
    }
}
