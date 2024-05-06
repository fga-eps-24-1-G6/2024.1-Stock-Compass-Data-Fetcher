import { Inject, Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { stocks } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Stock } from '../stock.interface';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzel.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from "../../db/schema";
import { CreateStockDto, UpdateStockDto } from '../stocks.dtos';

@Injectable()
export class StockDrizzleRepository implements StockRepository {
    constructor(@Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>) { }

    async findOne(id: number): Promise<Stock | undefined> {
        const result = await this.db.select().from(stocks).where(eq(stocks.id, id));
        return result[0] as Stock;
    }

    async findAll(): Promise<Stock[] | undefined> {
        const result = await this.db.select().from(stocks);
        return result as Stock[];
    }

    async findByTicker(ticker: string): Promise<Stock | undefined> {
        const result = await this.db.select().from(stocks).where(eq(stocks.ticker, ticker));
        return result[0] as Stock;
    }

    async create(createStockDto: CreateStockDto): Promise<Stock> {
        const result = await this.db.insert(stocks).values(createStockDto).returning();

        return result[0];
    }

    async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
        const filteredEntries = Object.entries(updateStockDto).filter(([_, value]) => value !== null);
        const updateData = Object.fromEntries(filteredEntries);

        const result = await this.db.update(stocks)
            .set(updateData)
            .where(eq(stocks.id, id))
            .returning();

        return result[0];
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(stocks).where(eq(stocks.id, id));
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(stocks);
    }
}
