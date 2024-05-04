import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { companies } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Company } from '../company.interface';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzel.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from "../../db/schema";
import { CreateCompanyDto, UpdateCompanyDto } from '../companies.dtos';

@Injectable()
export class CompanyDrizzleRepository implements CompanyRepository {
    constructor(@Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>) { }

    async findOne(id: number): Promise<Company | undefined> {
        const result = await this.db.select().from(companies).where(eq(companies.id, id));
        return result[0] as Company;
    }

    async findByName(name: string): Promise<Company | undefined> {
        const result = await this.db.select().from(companies).where(eq(companies.name, name));
        return result[0] as Company;
    }

    async findAll(): Promise<Company[] | undefined> {
        const result = await this.db.select().from(companies);
        return result as Company[];
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const result = await this.db.insert(companies).values({
            externalId: createCompanyDto.externalId,
            name: createCompanyDto.name,
            cnpj: createCompanyDto.cnpj,
            ipo: createCompanyDto.ipo,
            foundationYear: createCompanyDto.foundationYear,
            firmValue: createCompanyDto.firmValue,
            numberOfPapers: createCompanyDto.numberOfPapers,
            marketSegment: createCompanyDto.marketSegment,
            sector: createCompanyDto.sector,
            segment: createCompanyDto.segment
        }).returning();

        return result[0];
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const filteredEntries = Object.entries(updateCompanyDto).filter(([key, value]) => value !== null);
        const updateData = Object.fromEntries(filteredEntries);

        const result = await this.db.update(companies)
            .set(updateData)
            .where(eq(companies.id, id))
            .returning();

        return result[0];
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(companies).where(eq(companies.id, id));
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(companies);
    }
}
