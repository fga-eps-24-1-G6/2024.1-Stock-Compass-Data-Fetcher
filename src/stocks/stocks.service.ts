import { Inject, Injectable } from '@nestjs/common';
import { StockRepository } from './repositories/stock.repository';
import { Stock } from './stock.interface';
import { StockDrizzleRepository } from './repositories/stock.drizzle.repository';
import { CreateStockDto, UpdateStockDto } from './stocks.dtos';

@Injectable()
export class StocksService {
    constructor(
        @Inject(StockDrizzleRepository) private readonly stockRepository: StockRepository
    ) { }

    async getStock(id: string): Promise<Stock | undefined> {
        return await this.stockRepository.findOne(parseInt(id));
    }

    async getAllStocks(): Promise<Stock[] | undefined> {
        return await this.stockRepository.findAll();
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
