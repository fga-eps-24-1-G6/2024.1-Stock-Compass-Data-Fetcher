import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from './repositories/company.repository';
import { Company } from './company.interface';
import { CompanyDrizzleRepository } from './repositories/company.drizzle.repository';
import { CreateCompanyDto, UpdateCompanyDto } from './companies.dtos';

@Injectable()
export class CompaniesService {
    constructor(
        @Inject(CompanyDrizzleRepository) private readonly companyRepository: CompanyRepository
    ) { }

    async getCompany(id: string): Promise<Company | undefined> {
        return await this.companyRepository.findOne(parseInt(id));
    }

    async getAllCompanies(): Promise<Company[] | undefined> {
        return await this.companyRepository.findAll();
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company | undefined> {
        console.log('chegou 2');
        return await this.companyRepository.create(createCompanyDto);
    }

    async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company | undefined> {
        return await this.companyRepository.update(parseInt(id), updateCompanyDto);
    }

    async deleteCompany(id: string) {
        await this.companyRepository.delete(parseInt(id));
    }
}
