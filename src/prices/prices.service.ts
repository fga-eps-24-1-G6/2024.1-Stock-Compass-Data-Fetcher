import { Inject, Injectable } from '@nestjs/common';
import { PriceRepository } from './repositories/price.repository';
import { Price } from './price.interface';
import { PriceDrizzleRepository } from './repositories/price.drizzle.repository';
import { CreatePriceDto, GetPriceDto, UpdatePriceDto } from './prices.dtos';

@Injectable()
export class PricesService {
    constructor(
        @Inject(PriceDrizzleRepository) private readonly priceRepository: PriceRepository
    ) { }

    async getPrice(id: string): Promise<GetPriceDto | undefined> {
        const price = await this.priceRepository.findOne(parseInt(id));
        return {
            stockId: price.stockId,
            value: price.value,
            priceDate: price.priceDate
        }
    }

    async getAllPrices(): Promise<GetPriceDto[] | undefined> {
        const prices = await this.priceRepository.findAll();
        return prices.map(price => ({
            stockId: price.stockId,
            value: price.value,
            priceDate: price.priceDate
        }))
    }

    async getStockPrices(id: string): Promise<GetPriceDto[] | undefined> {
        const prices = await this.priceRepository.findByStock(parseInt(id));
        return prices.map(price => ({
            stockId: price.stockId,
            value: price.value,
            priceDate: price.priceDate
        }))
    }

    async createPrice(createPriceDto: CreatePriceDto): Promise<Price | undefined> {
        return await this.priceRepository.create(createPriceDto);
    }

    async updatePrice(id: string, updatePriceDto: UpdatePriceDto): Promise<Price | undefined> {
        return await this.priceRepository.update(parseInt(id), updatePriceDto);
    }

    async deletePrice(id: string) {
        await this.priceRepository.delete(parseInt(id));
    }
}
