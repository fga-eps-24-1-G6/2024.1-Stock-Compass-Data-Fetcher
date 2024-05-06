import { CreateCompanyDto, UpdateCompanyDto } from "../companies.dtos";
import { Company } from "../company.interface";

export interface CompanyRepository {
    findOne(id: number): Promise<Company | undefined>;
    findByName(name: string): Promise<Company | undefined>;
    findAll(): Promise<Company[]>;
    create(createCompanyDto: CreateCompanyDto): Promise<Company>;
    update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}
