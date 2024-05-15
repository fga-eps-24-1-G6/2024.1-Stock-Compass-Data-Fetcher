import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, GetCompanyDto, UpdateCompanyDto } from './companies.dtos';
import { Company } from './company.interface';
import { CompanyRepository } from './repositories/company.repository';

describe('CompaniesService', () => {
    let service: CompaniesService;
    let repository: CompanyRepository;

    const company: Company = {
        id: 1,
        externalId: '3',
        name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
        cnpj: '42771949000135',
        ipo: 1997,
        foundationYear: 1990,
        firmValue: 2085322000,
        numberOfPapers: 118292000,
        marketSegment: 'Novo Mercado',
        sector: 'Saúde',
        segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
    };

    const mockCompanyRepository = {
        findOne: jest.fn().mockResolvedValue(company),
        findAll: jest.fn().mockResolvedValue([company]),
        create: jest.fn().mockResolvedValue(company),
        update: jest.fn().mockResolvedValue(company),
        delete: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                {
                    provide: 'CompanyRepository',
                    useValue: mockCompanyRepository,
                }
            ],
        }).compile();

        service = module.get<CompaniesService>(CompaniesService);
        repository = module.get<CompanyRepository>('CompanyRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCompany', () => {
        const getCompanyDto: GetCompanyDto = {
            name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
            cnpj: '42771949000135',
            ipo: 1997,
            foundationYear: 1990,
            firmValue: 2085322000,
            numberOfPapers: 118292000,
            marketSegment: 'Novo Mercado',
            sector: 'Saúde',
            segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
        };

        it('should return a company DTO', async () => {
            const result = await service.getCompany('1');
            expect(result).toEqual(getCompanyDto);
            expect(repository.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllCompanies', () => {
        const getCompanyDto: GetCompanyDto = {
            name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
            cnpj: '42771949000135',
            ipo: 1997,
            foundationYear: 1990,
            firmValue: 2085322000,
            numberOfPapers: 118292000,
            marketSegment: 'Novo Mercado',
            sector: 'Saúde',
            segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
        };

        it('should return an array of company DTOs', async () => {
            const result = await service.getAllCompanies();
            expect(result).toEqual([getCompanyDto]);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe('createCompany', () => {
        const createCompanyDto: CreateCompanyDto = {
            externalId: '3',
            name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
            cnpj: '42771949000135',
            ipo: 1997,
            foundationYear: 1990,
            firmValue: 2085322000,
            numberOfPapers: 118292000,
            marketSegment: 'Novo Mercado',
            sector: 'Saúde',
            segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
        };

        it('should create a new company', async () => {
            const result = await service.createCompany(createCompanyDto);
            expect(result).toEqual(company);
            expect(repository.create).toHaveBeenCalledWith(createCompanyDto);
        });
    });

    describe('updateCompany', () => {
        const updateCompanyDto: UpdateCompanyDto = {
            numberOfPapers: 300000000,
        };

        it('should update a company', async () => {
            const result = await service.updateCompany('1', updateCompanyDto);
            expect(result).toEqual(company);
            expect(repository.update).toHaveBeenCalledWith(1, updateCompanyDto);
        });
    });

    describe('deleteCompany', () => {
        it('should delete a company', async () => {
            await service.deleteCompany('1');
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
