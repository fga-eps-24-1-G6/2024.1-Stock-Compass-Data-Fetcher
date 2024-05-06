import { Inject, Injectable } from '@nestjs/common';
import { PriceRepository } from './repositories/price.repository';
import { Price } from './price.interface';
import { PriceDrizzleRepository } from './repositories/price.drizzle.repository';
import { CreatePriceDto, UpdatePriceDto } from './prices.dtos';

@Injectable()
export class PricesService {
    constructor(
        @Inject(PriceDrizzleRepository) private readonly priceRepository: PriceRepository
    ) { }

    async getPrice(id: string): Promise<Price | undefined> {
        return await this.priceRepository.findOne(parseInt(id));
    }

    async getAllPrices(): Promise<Price[] | undefined> {
        return await this.priceRepository.findAll();
    }

    async getStockPrices(id: string): Promise<Price[] | undefined> {
        return await this.priceRepository.findByStock(parseInt(id));
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
