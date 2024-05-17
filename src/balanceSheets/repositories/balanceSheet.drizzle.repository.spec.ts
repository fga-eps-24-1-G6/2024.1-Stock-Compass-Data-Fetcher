import { Test, TestingModule } from '@nestjs/testing';
import { BalanceSheetDrizzleRepository } from './balanceSheet.drizzle.repository';
import { BalanceSheet } from '../balanceSheet.interface';
import { CreateBalanceSheetDto, UpdateBalanceSheetDto } from '../balanceSheets.dtos';
import { balanceSheets } from '../../db/schema';

describe('BalanceSheetDrizzleRepository', () => {
    let repository: BalanceSheetDrizzleRepository;
    let dbMock: any;

    const balanceSheet = {
        id: 1,
        companyId: 2,
        year: 2024,
        quarter: 1,
        netRevenue: 10000000,
        costs: 10000000,
        grossProfit: 10000000,
        netProfit: 10000000,
        ebitda: 10000000,
        ebit: 10000000,
        taxes: 10000000,
        grossDebt: 10000000,
        netDebt: 10000000,
        equity: 10000000,
        cash: 10000000,
        assets: 10000000,
        liabilities: 10000000
    } as BalanceSheet;

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
                BalanceSheetDrizzleRepository,
                {
                    provide: 'DrizzelProvider',
                    useValue: dbMock,
                },
            ],
        }).compile();

        repository = module.get<BalanceSheetDrizzleRepository>(BalanceSheetDrizzleRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a balanceSheet by id', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([balanceSheet])
                })
            });

            const result = await repository.findOne(1);
            expect(result).toEqual(balanceSheet);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all balanceSheets', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce([balanceSheet])
            });

            const result = await repository.findAll();
            expect(result).toEqual([balanceSheet]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findByCompany', () => {
        it('should return a balanceSheet by companyId', async () => {
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([balanceSheet])
                })
            });

            const result = await repository.findByCompany(2);
            expect(result).toEqual([balanceSheet]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findByCompany', () => {
        it('should return all balanceSheets grouped by ccompany', async () => {
            const balanceSheetData = {
                companyId: 1,
                externalId: '2',
                name: 'WEGE',
                balanceSheetYear: 2024,
                balanceSheetQuarter: 1,
            }
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    rightJoin: jest.fn().mockReturnValueOnce({
                        orderBy: jest.fn().mockReturnValueOnce([balanceSheetData])
                    })
                })
            });

            const result = await repository.findAllGroupedByCompany();
            expect(result).toEqual([balanceSheetData]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new balanceSheet', async () => {
            const createBalanceSheetDto = {
                companyId: 2,
                year: 2024,
                quarter: 1,
                netRevenue: 10000000,
                costs: 10000000,
                grossProfit: 10000000,
                netProfit: 10000000,
                ebitda: 10000000,
                ebit: 10000000,
                taxes: 10000000,
                grossDebt: 10000000,
                netDebt: 10000000,
                equity: 10000000,
                cash: 10000000,
                assets: 10000000,
                liabilities: 10000000
            } as CreateBalanceSheetDto;

            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([balanceSheet])
                }),
            });

            const result = await repository.create(createBalanceSheetDto);
            expect(result).toEqual(balanceSheet);
            expect(dbMock.insert).toHaveBeenCalledWith(balanceSheets);
        });
    });

    describe('createMultiple', () => {
        it('should create new balance sheets', async () => {
            const createBalanceSheetDto = {
                companyId: 2,
                year: 2024,
                quarter: 1,
                netRevenue: 10000000,
                costs: 10000000,
                grossProfit: 10000000,
                netProfit: 10000000,
                ebitda: 10000000,
                ebit: 10000000,
                taxes: 10000000,
                grossDebt: 10000000,
                netDebt: 10000000,
                equity: 10000000,
                cash: 10000000,
                assets: 10000000,
                liabilities: 10000000
            } as CreateBalanceSheetDto;

            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([balanceSheet])
                }),
            });

            const result = await repository.createMultiple([createBalanceSheetDto]);
            expect(result).toEqual([balanceSheet]);
            expect(dbMock.insert).toHaveBeenCalledWith(balanceSheets);
        });
    });

    describe('update', () => {
        it('should update a balanceSheet by id', async () => {
            const updateBalanceSheetDto = { assets: 9888888 } as UpdateBalanceSheetDto;

            dbMock.update.mockReturnValueOnce({
                set: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce({
                        returning: jest.fn().mockReturnValueOnce([balanceSheet])
                    }),
                })
            });

            const result = await repository.update(1, updateBalanceSheetDto);
            expect(result).toEqual(balanceSheet);
            expect(dbMock.update).toHaveBeenCalledWith(balanceSheets);
        });
    });

    describe('delete', () => {
        it('should delete a balanceSheet by id', async () => {
            dbMock.delete.mockReturnValueOnce({ where: jest.fn() });

            await repository.delete(1);
            expect(dbMock.delete).toHaveBeenCalledWith(balanceSheets);
        });
    });

    describe('deleteAll', () => {
        it('should delete all balanceSheets', async () => {
            await repository.deleteAll();
            expect(dbMock.delete).toHaveBeenCalledWith(balanceSheets);
        });
    });
});
