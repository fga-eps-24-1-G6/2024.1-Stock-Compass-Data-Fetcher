import { Inject, Injectable } from '@nestjs/common';
import { BalanceSheetRepository } from './repositories/balanceSheet.repository';
import { BalanceSheet } from './balanceSheet.interface';
import { BalanceSheetDrizzleRepository } from './repositories/balanceSheet.drizzle.repository';
import { CreateBalanceSheetDto, UpdateBalanceSheetDto } from './balanceSheets.dtos';

@Injectable()
export class BalanceSheetsService {
    constructor(
        @Inject(BalanceSheetDrizzleRepository) private readonly balanceSheetRepository: BalanceSheetRepository
    ) { }

    async getBalanceSheet(id: string): Promise<BalanceSheet | undefined> {
        return await this.balanceSheetRepository.findOne(parseInt(id));
    }

    async getAllBalanceSheets(): Promise<BalanceSheet[] | undefined> {
        return await this.balanceSheetRepository.findAll();
    }

    async getBalanceSheetsFromCompany(id: string): Promise<BalanceSheet[] | undefined> {
        return await this.balanceSheetRepository.findByCompany(parseInt(id));
    }

    async createBalanceSheet(createBalanceSheetDto: CreateBalanceSheetDto): Promise<BalanceSheet | undefined> {
        return await this.balanceSheetRepository.create(createBalanceSheetDto);
    }

    async updateBalanceSheet(id: string, updateBalanceSheetDto: UpdateBalanceSheetDto): Promise<BalanceSheet | undefined> {
        return await this.balanceSheetRepository.update(parseInt(id), updateBalanceSheetDto);
    }

    async deleteBalanceSheet(id: string) {
        await this.balanceSheetRepository.delete(parseInt(id));
    }
}
