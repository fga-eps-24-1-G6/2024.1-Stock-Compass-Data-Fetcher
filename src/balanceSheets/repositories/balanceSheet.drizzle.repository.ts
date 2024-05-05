import { Inject, Injectable } from '@nestjs/common';
import { BalanceSheetRepository } from './balanceSheet.repository';
import { balanceSheets } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { BalanceSheet } from '../balanceSheet.interface';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzel.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from "../../db/schema";
import { CreateBalanceSheetDto, UpdateBalanceSheetDto } from '../balanceSheets.dtos';

@Injectable()
export class BalanceSheetDrizzleRepository implements BalanceSheetRepository {
    constructor(@Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>) { }

    async findOne(id: number): Promise<BalanceSheet | undefined> {
        const result = await this.db.select().from(balanceSheets).where(eq(balanceSheets.id, id));
        return result[0] as BalanceSheet;
    }

    async findAll(): Promise<BalanceSheet[] | undefined> {
        const result = await this.db.select().from(balanceSheets);
        return result as BalanceSheet[];
    }

    async findByCompany(companyId: number): Promise<BalanceSheet[] | undefined> {
        const result = await this.db.select().from(balanceSheets).where(eq(balanceSheets.companyId, companyId));
        return result;
    }

    async create(createBalanceSheetDto: CreateBalanceSheetDto): Promise<BalanceSheet> {
        const result = await this.db.insert(balanceSheets).values(createBalanceSheetDto).returning();

        return result[0];
    }

    async createMultiple(createBalanceSheetDto: CreateBalanceSheetDto[]): Promise<BalanceSheet[]> {
        const result = await this.db.insert(balanceSheets).values(createBalanceSheetDto).returning();

        return result;
    }

    async update(id: number, updateBalanceSheetDto: UpdateBalanceSheetDto): Promise<BalanceSheet> {
        const filteredEntries = Object.entries(updateBalanceSheetDto).filter(([_, value]) => value !== null);
        const updateData = Object.fromEntries(filteredEntries);

        const result = await this.db.update(balanceSheets)
            .set(updateData)
            .where(eq(balanceSheets.id, id))
            .returning();

        return result[0];
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(balanceSheets).where(eq(balanceSheets.id, id));
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(balanceSheets);
    }
}
