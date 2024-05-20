import { Test, TestingModule } from '@nestjs/testing';
import { BalanceSheetsController } from './balanceSheets.controller';
import { BalanceSheetsService } from './balanceSheets.service';
import { GetBalanceSheetDto } from './balanceSheets.dtos';

describe('BalanceSheetsController', () => {
    let controller: BalanceSheetsController;
    let service: BalanceSheetsService;

    const balanceSheetDto: GetBalanceSheetDto = {
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

    const mockBalanceSheetsService = {
        getCompanyBalanceSheets: jest.fn().mockResolvedValue([balanceSheetDto]),
        getAllBalanceSheets: jest.fn().mockResolvedValue([balanceSheetDto]),
        getBalanceSheet: jest.fn().mockResolvedValue(balanceSheetDto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BalanceSheetsController],
            providers: [
                {
                    provide: BalanceSheetsService,
                    useValue: mockBalanceSheetsService,
                },
            ],
        }).compile();

        controller = module.get<BalanceSheetsController>(BalanceSheetsController);
        service = module.get<BalanceSheetsService>(BalanceSheetsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllBalanceSheets', () => {
        describe('when an id is passed',()=>{
            it('should return an array of a company balance sheets', async () => {
                const result = await controller.getAllBalanceSheets('2');
                expect(result).toEqual([balanceSheetDto]);
                expect(service.getCompanyBalanceSheets).toHaveBeenCalled();
            });
        });

        describe('when an id not is passed',()=>{
            it('should return an array of all balance sheets', async () => {
                const result = await controller.getAllBalanceSheets();
                expect(result).toEqual([balanceSheetDto]);
                expect(service.getAllBalanceSheets).toHaveBeenCalled();
            });
        })
    });

    describe('getBalanceSheet', () => {
        it('should return a balance sheet DTO', async () => {
            const id = '1';
            const result = await controller.getBalanceSheet(id);
            expect(result).toEqual(balanceSheetDto);
            expect(service.getBalanceSheet).toHaveBeenCalledWith(id);
        });
    });
});
