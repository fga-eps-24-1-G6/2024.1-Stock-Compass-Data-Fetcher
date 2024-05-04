import { Inject, Injectable } from '@nestjs/common';
import { DividendRepository } from './dividend.repository';
import { dividends } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Dividend } from '../dividend.interface';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzel.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from "../../db/schema";
import { CreateDividendDto, UpdateDividendDto } from '../dividends.dtos';

@Injectable()
export class DividendDrizzleRepository implements DividendRepository {
    constructor(@Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>) { }

    async findOne(id: number): Promise<Dividend | undefined> {
        const result = await this.db.select().from(dividends).where(eq(dividends.id, id));
        return {
            ...result[0],
            value: parseFloat(result[0].value),
            ownershipDate: new Date(result[0].ownershipDate),
            paymentDate: new Date(result[0].paymentDate)
        } as Dividend;
    }

    async findAll(): Promise<Dividend[] | undefined> {
        const result = await this.db.select().from(dividends);
        return result.map((item) => (
            {
                ...item,
                value: parseFloat(item.value),
                ownershipDate: new Date(item.ownershipDate),
                paymentDate: new Date(item.paymentDate)
            }
        )) as Dividend[];
    }

    async findByStock(stockId: number): Promise<Dividend[] | undefined> {
        const result = await this.db.select().from(dividends).where(eq(dividends.stockId, stockId));
        return result.map((item) => (
            {
                ...item,
                value: parseFloat(item.value),
                ownershipDate: new Date(item.ownershipDate),
                paymentDate: new Date(item.paymentDate)
            }
        )) as Dividend[];
    }

    async create(createDividendDto: CreateDividendDto): Promise<Dividend> {
        const result = await this.db.insert(dividends).values({
            ...createDividendDto,
            value: createDividendDto.value.toString(),
            ownershipDate: createDividendDto.ownershipDate.toString(),
            paymentDate: createDividendDto.paymentDate.toString()
        }).returning();

        return {
            ...result[0],
            value: parseFloat(result[0].value),
            ownershipDate: new Date(result[0].ownershipDate),
            paymentDate: new Date(result[0].paymentDate)
        } as Dividend;
    }

    async update(id: number, updateDividendDto: UpdateDividendDto): Promise<Dividend> {
        const filteredEntries = Object.entries(updateDividendDto).filter(([_, value]) => value !== null);
        const updateData = Object.fromEntries(filteredEntries);

        const result = await this.db.update(dividends)
            .set(updateData)
            .where(eq(dividends.id, id))
            .returning();

        return {
            ...result[0],
            value: parseFloat(result[0].value),
            ownershipDate: new Date(result[0].ownershipDate),
            paymentDate: new Date(result[0].paymentDate)
        } as Dividend;
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(dividends).where(eq(dividends.id, id));
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(dividends);
    }
}
