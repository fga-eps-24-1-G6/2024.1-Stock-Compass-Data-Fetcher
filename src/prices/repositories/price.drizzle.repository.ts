import { Inject, Injectable } from '@nestjs/common';
import { PriceRepository } from './price.repository';
import { prices } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Price } from '../price.interface';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzel.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from "../../db/schema";
import { CreatePriceDto, UpdatePriceDto } from '../prices.dtos';

@Injectable()
export class PriceDrizzleRepository implements PriceRepository {
    constructor(@Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>) { }

    async findOne(id: number): Promise<Price | undefined> {
        const result = await this.db.select().from(prices).where(eq(prices.id, id));
        return {
            ...result[0],
            value: parseFloat(result[0].value),
            priceDate: new Date(result[0].priceDate)
        } as Price;
    }

    async findAll(): Promise<Price[] | undefined> {
        const result = await this.db.select().from(prices);
        return result.map((item) => (
            {
                ...item,
                value: parseFloat(item.value),
                priceDate: new Date(item.priceDate)
            }
        )) as Price[];
    }

    async findByStock(stockId: number): Promise<Price[] | undefined> {
        const result = await this.db.select().from(prices).where(eq(prices.stockId, stockId));

        return result.map((item) => (
            {
                ...item,
                value: parseFloat(item.value),
                priceDate: new Date(item.priceDate)
            }
        )) as Price[];
    }

    async create(createPriceDto: CreatePriceDto): Promise<Price> {
        const result = await this.db.insert(prices).values(createPriceDto).returning();

        return {
            ...result[0],
            value: parseFloat(result[0].value),
            priceDate: new Date(result[0].priceDate)
        } as Price;
    }

    async createMultiple(createPriceDto: CreatePriceDto[]): Promise<Price[]> {
        const result = await this.db.insert(prices).values(createPriceDto).returning();

        return result.map(item => ({
            ...item,
            value: parseFloat(item.value),
            priceDate: new Date(item.priceDate)
        })) as Price[];
    }

    async update(id: number, updatePriceDto: UpdatePriceDto): Promise<Price> {
        const filteredEntries = Object.entries(updatePriceDto).filter(([_, value]) => value !== null);
        const updateData = Object.fromEntries(filteredEntries);

        const result = await this.db.update(prices)
            .set(updateData)
            .where(eq(prices.id, id))
            .returning();

        return {
            ...result[0],
            value: parseFloat(result[0].value),
            priceDate: new Date(result[0].priceDate)
        } as Price;
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(prices).where(eq(prices.id, id));
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(prices);
    }
}
