import { Test, TestingModule } from '@nestjs/testing';
import { BalanceSheetsService } from './balanceSheets.service';
import { CreateBalanceSheetDto, GetBalanceSheetDto, UpdateBalanceSheetDto } from './balanceSheets.dtos';
import { BalanceSheet } from './balanceSheet.interface';
import { BalanceSheetRepository } from './repositories/balanceSheet.repository';

describe('BalanceSheetsService', () => {
    let service: BalanceSheetsService;
    let repository: BalanceSheetRepository;

    const balanceSheet: BalanceSheet = {
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
    };

    const getBalanceSheetDto: GetBalanceSheetDto = {
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
    };

    const mockBalanceSheetRepository = {
        findOne: jest.fn().mockResolvedValue(balanceSheet),
        findAll: jest.fn().mockResolvedValue([balanceSheet]),
        findByCompany: jest.fn().mockResolvedValue([balanceSheet]),
        create: jest.fn().mockResolvedValue(balanceSheet),
        update: jest.fn().mockResolvedValue(balanceSheet),
        delete: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BalanceSheetsService,
                {
                    provide: 'BalanceSheetRepository',
                    useValue: mockBalanceSheetRepository,
                }
            ],
        }).compile();

        service = module.get<BalanceSheetsService>(BalanceSheetsService);
        repository = module.get<BalanceSheetRepository>('BalanceSheetRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getBalanceSheet', () => {
        it('should return a balance sheet DTO', async () => {
            const result = await service.getBalanceSheet('1');
            expect(result).toEqual(getBalanceSheetDto);
            expect(repository.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('getCompanyBalanceSheets', () => {
        it('should return a company balance sheets', async () => {
            const result = await service.getCompanyBalanceSheets('2');
            expect(result).toEqual([getBalanceSheetDto]);
            expect(repository.findByCompany).toHaveBeenCalledWith(2);
        });
    });

    describe('getAllBalanceSheets', () => {
        it('should return all balance sheet', async () => {
            const result = await service.getAllBalanceSheets();
            expect(result).toEqual([getBalanceSheetDto]);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe('createBalanceSheet', () => {
        const createBalanceSheetDto: CreateBalanceSheetDto = {
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
        };

        it('should create a new balance sheet', async () => {
            const result = await service.createBalanceSheet(createBalanceSheetDto);
            expect(result).toEqual(balanceSheet);
            expect(repository.create).toHaveBeenCalledWith(createBalanceSheetDto);
        });
    });

    describe('updateBalanceSheet', () => {
        const updateBalanceSheetDto: UpdateBalanceSheetDto = {
            assets: 988888888,
        };

        it('should update a balance sheet', async () => {
            const result = await service.updateBalanceSheet('1', updateBalanceSheetDto);
            expect(result).toEqual(balanceSheet);
            expect(repository.update).toHaveBeenCalledWith(1, updateBalanceSheetDto);
        });
    });

    describe('deleteBalanceSheet', () => {
        it('should delete a balance sheet', async () => {
            await service.deleteBalanceSheet('1');
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
