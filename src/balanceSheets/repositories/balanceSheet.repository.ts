import { CreateBalanceSheetDto, UpdateBalanceSheetDto } from "../balanceSheets.dtos";
import { BalanceSheet } from "../balanceSheet.interface";

export interface BalanceSheetRepository {
    findOne(id: number): Promise<BalanceSheet | undefined>;
    findAll(): Promise<BalanceSheet[]>;
    findByCompany(comapanyId: number): Promise<BalanceSheet[]>;
    create(createBalanceSheetDto: CreateBalanceSheetDto): Promise<BalanceSheet>;
    update(id: number, updateBalanceSheetDto: UpdateBalanceSheetDto): Promise<BalanceSheet>;
    delete(id: number): Promise<void>;
}
