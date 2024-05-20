import { Inject, Injectable } from '@nestjs/common';
import { BalanceSheetRepository } from './repositories/balanceSheet.repository';
import { BalanceSheet } from './balanceSheet.interface';
import { CreateBalanceSheetDto, GetBalanceSheetDto, UpdateBalanceSheetDto } from './balanceSheets.dtos';

@Injectable()
export class BalanceSheetsService {
    constructor(
        @Inject('BalanceSheetRepository') private readonly balanceSheetRepository: BalanceSheetRepository
    ) { }

    async getBalanceSheet(id: string): Promise<GetBalanceSheetDto | undefined> {
        const balanceSheet = await this.balanceSheetRepository.findOne(parseInt(id));
        return {
            companyId: balanceSheet.companyId,
            year: balanceSheet.year,
            quarter: balanceSheet.quarter,
            netRevenue: balanceSheet.netRevenue,
            costs: balanceSheet.costs,
            grossProfit: balanceSheet.grossProfit,
            netProfit: balanceSheet.netProfit,
            ebitda: balanceSheet.ebitda,
            ebit: balanceSheet.ebit,
            taxes: balanceSheet.taxes,
            grossDebt: balanceSheet.grossDebt,
            netDebt: balanceSheet.netDebt,
            equity: balanceSheet.equity,
            cash: balanceSheet.cash,
            assets: balanceSheet.assets,
            liabilities: balanceSheet.liabilities
        }
    }

    async getAllBalanceSheets(): Promise<GetBalanceSheetDto[] | undefined> {
        const balanceSheets = await this.balanceSheetRepository.findAll();
        return balanceSheets.map(balanceSheet => ({
            companyId: balanceSheet.companyId,
            year: balanceSheet.year,
            quarter: balanceSheet.quarter,
            netRevenue: balanceSheet.netRevenue,
            costs: balanceSheet.costs,
            grossProfit: balanceSheet.grossProfit,
            netProfit: balanceSheet.netProfit,
            ebitda: balanceSheet.ebitda,
            ebit: balanceSheet.ebit,
            taxes: balanceSheet.taxes,
            grossDebt: balanceSheet.grossDebt,
            netDebt: balanceSheet.netDebt,
            equity: balanceSheet.equity,
            cash: balanceSheet.cash,
            assets: balanceSheet.assets,
            liabilities: balanceSheet.liabilities
        }))
    }

    async getCompanyBalanceSheets(id: string): Promise<GetBalanceSheetDto[] | undefined> {
        const balanceSheets = await this.balanceSheetRepository.findByCompany(parseInt(id));
        return balanceSheets.map(balanceSheet => ({
            companyId: balanceSheet.companyId,
            year: balanceSheet.year,
            quarter: balanceSheet.quarter,
            netRevenue: balanceSheet.netRevenue,
            costs: balanceSheet.costs,
            grossProfit: balanceSheet.grossProfit,
            netProfit: balanceSheet.netProfit,
            ebitda: balanceSheet.ebitda,
            ebit: balanceSheet.ebit,
            taxes: balanceSheet.taxes,
            grossDebt: balanceSheet.grossDebt,
            netDebt: balanceSheet.netDebt,
            equity: balanceSheet.equity,
            cash: balanceSheet.cash,
            assets: balanceSheet.assets,
            liabilities: balanceSheet.liabilities
        }))
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
