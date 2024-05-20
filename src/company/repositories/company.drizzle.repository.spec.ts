import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDrizzleRepository } from './company.drizzle.repository';
import { Company } from '../company.interface';
import { CreateCompanyDto, UpdateCompanyDto } from '../companies.dtos';
import { companies } from '../../db/schema';

describe('CompanyDrizzleRepository', () => {
    let repository: CompanyDrizzleRepository;
    let dbMock: any;

    const company = {
        id: 1,
        externalId: '1',
        name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
        cnpj: '42771949000135',
        ipo: 1997,
        foundationYear: 1990,
        firmValue: 2085322000,
        numberOfPapers: 118292000,
        marketSegment: 'Novo Mercado',
        sector: 'Saúde',
        segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
    } as Company;

    beforeEach(async () => {
        dbMock = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyDrizzleRepository,
                {
                    provide: 'DrizzelProvider',
                    useValue: dbMock,
                },
            ],
        }).compile();

        repository = module.get<CompanyDrizzleRepository>(CompanyDrizzleRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a company by id', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([company])
                })
            });

            const result = await repository.findOne(1);
            expect(result).toEqual(company);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findByName', () => {
        it('should return a company by id', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([company])
                })
            });

            const result = await repository.findByName('ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.');
            expect(result).toEqual(company);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all companies', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce([company])
            });

            const result = await repository.findAll();
            expect(result).toEqual([company]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new company', async () => {
            const createCompanyDto = {
                name: 'ALLIANÇA SAÚDE E PARTICIPAÇÕES S.A.',
                cnpj: '42771949000135',
                ipo: 1997,
                foundationYear: 1990,
                firmValue: 2085322000,
                numberOfPapers: 118292000,
                marketSegment: 'Novo Mercado',
                sector: 'Saúde',
                segment: 'Serviços Médicos, Hospitalares, Análises e Diagnósticos'
            } as CreateCompanyDto;

            const company = { id: 1, ...createCompanyDto } as Company;

            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([company])
                }),
            });

            const result = await repository.create(createCompanyDto);
            expect(result).toEqual(company);
            expect(dbMock.insert).toHaveBeenCalledWith(companies);
        });
    });

    describe('update', () => {
        it('should update a company by id', async () => {
            const updateCompanyDto = { numberOfPapers: 516656756 } as UpdateCompanyDto;

            dbMock.update.mockReturnValueOnce({
                set: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce({
                        returning: jest.fn().mockReturnValueOnce([company])
                    }),
                })
            });

            const result = await repository.update(1, updateCompanyDto);
            expect(result).toEqual(company);
            expect(dbMock.update).toHaveBeenCalledWith(companies);
        });
    });

    describe('delete', () => {
        it('should delete a company by id', async () => {
            dbMock.delete.mockReturnValueOnce({ where: jest.fn() });

            await repository.delete(1);
            expect(dbMock.delete).toHaveBeenCalledWith(companies);
        });
    });

    describe('deleteAll', () => {
        it('should delete all companies', async () => {
            await repository.deleteAll();
            expect(dbMock.delete).toHaveBeenCalledWith(companies);
        });
    });
});
