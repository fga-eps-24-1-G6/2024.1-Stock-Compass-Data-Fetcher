import { Inject, Injectable } from '@nestjs/common';
import { DividendRepository } from './repositories/dividend.repository';
import { Dividend } from './dividend.interface';
import { DividendDrizzleRepository } from './repositories/dividend.drizzle.repository';
import { CreateDividendDto, UpdateDividendDto } from './dividends.dtos';

@Injectable()
export class DividendsService {
    constructor(
        @Inject(DividendDrizzleRepository) private readonly dividendRepository: DividendRepository
    ) { }

    async getDividend(id: string): Promise<Dividend | undefined> {
        return await this.dividendRepository.findOne(parseInt(id));
    }

    async getAllDividends(): Promise<Dividend[] | undefined> {
        return await this.dividendRepository.findAll();
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
