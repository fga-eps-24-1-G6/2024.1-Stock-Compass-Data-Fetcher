import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { GetCompanyDto } from './companies.dtos';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let service: CompaniesService;

    const companyDto: GetCompanyDto = {
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

    const mockCompaniesService = {
        getAllCompanies: jest.fn().mockResolvedValue([companyDto]),
        getCompany: jest.fn().mockResolvedValue(companyDto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                {
                    provide: CompaniesService,
                    useValue: mockCompaniesService,
                },
            ],
        }).compile();

        controller = module.get<CompaniesController>(CompaniesController);
        service = module.get<CompaniesService>(CompaniesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllCompanies', () => {
        it('should return an array of company DTOs', async () => {
            const result = await controller.getAllCompanies();
            expect(result).toEqual([companyDto]);
            expect(service.getAllCompanies).toHaveBeenCalled();
        });
    });

    describe('getCompany', () => {
        it('should return a company DTO', async () => {
            const id = '1';
            const result = await controller.getCompany(id);
            expect(result).toEqual(companyDto);
            expect(service.getCompany).toHaveBeenCalledWith(id);
        });
    });
});
