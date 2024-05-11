import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from './repositories/company.repository';
import { Company } from './company.interface';
import { CompanyDrizzleRepository } from './repositories/company.drizzle.repository';
import { CreateCompanyDto, GetCompanyDto, UpdateCompanyDto } from './companies.dtos';

@Injectable()
export class CompaniesService {
    constructor(
        @Inject(CompanyDrizzleRepository) private readonly companyRepository: CompanyRepository
    ) { }

    async getCompany(id: string): Promise<GetCompanyDto | undefined> {
        const company = await this.companyRepository.findOne(parseInt(id));
        return {
            name: company.name,
            cnpj: company.cnpj,
            ipo: company.ipo,
            foundationYear: company.foundationYear,
            firmValue: company.firmValue,
            numberOfPapers: company.numberOfPapers,
            marketSegment: company.marketSegment,
            sector: company.sector,
            segment: company.segment
        }
    }

    async getAllCompanies(): Promise<GetCompanyDto[] | undefined> {
        const companies = await this.companyRepository.findAll();
        return companies.map(company => ({
            name: company.name,
            cnpj: company.cnpj,
            ipo: company.ipo,
            foundationYear: company.foundationYear,
            firmValue: company.firmValue,
            numberOfPapers: company.numberOfPapers,
            marketSegment: company.marketSegment,
            sector: company.sector,
            segment: company.segment
        }))
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company | undefined> {
        return await this.companyRepository.create(createCompanyDto);
    }

    async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company | undefined> {
        return await this.companyRepository.update(parseInt(id), updateCompanyDto);
    }

    async deleteCompany(id: string) {
        await this.companyRepository.delete(parseInt(id));
    }
}
