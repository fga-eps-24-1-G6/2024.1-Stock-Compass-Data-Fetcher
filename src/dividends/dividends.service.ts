import { Inject, Injectable } from '@nestjs/common';
import { DividendRepository } from './repositories/dividend.repository';
import { Dividend } from './dividend.interface';
import { DividendDrizzleRepository } from './repositories/dividend.drizzle.repository';
import { CreateDividendDto, GetDividendDto, UpdateDividendDto } from './dividends.dtos';

@Injectable()
export class DividendsService {
    constructor(
        @Inject(DividendDrizzleRepository) private readonly dividendRepository: DividendRepository
    ) { }

    async getDividend(id: string): Promise<GetDividendDto | undefined> {
        const dividend = await this.dividendRepository.findOne(parseInt(id));
        return {
            stockId: dividend.stockId,
            type: dividend.type,
            value: dividend.value,
            ownershipDate: dividend.ownershipDate,
            paymentDate: dividend.paymentDate
        }
    }

    async getAllDividends(): Promise<GetDividendDto[] | undefined> {
        const dividends = await this.dividendRepository.findAll();
        return dividends.map(dividend => ({
            stockId: dividend.stockId,
            type: dividend.type,
            value: dividend.value,
            ownershipDate: dividend.ownershipDate,
            paymentDate: dividend.paymentDate
        }))
    }

    async getStockDividends(id: string): Promise<GetDividendDto[] | undefined> {
        const dividends = await this.dividendRepository.findByStock(parseInt(id));
        return dividends.map(dividend => ({
            stockId: dividend.stockId,
            type: dividend.type,
            value: dividend.value,
            ownershipDate: dividend.ownershipDate,
            paymentDate: dividend.paymentDate
        }))
    }

    async createDividend(createDividendDto: CreateDividendDto): Promise<Dividend | undefined> {
        return await this.dividendRepository.create(createDividendDto);
    }

    async updateDividend(id: string, updateDividendDto: UpdateDividendDto): Promise<Dividend | undefined> {
        return await this.dividendRepository.update(parseInt(id), updateDividendDto);
    }

    async deleteDividend(id: string) {
        await this.dividendRepository.delete(parseInt(id));
    }
}
