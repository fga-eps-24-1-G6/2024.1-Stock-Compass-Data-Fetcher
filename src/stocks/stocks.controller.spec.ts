import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { GetStockDto } from './stocks.dtos';

describe('StocksController', () => {
    let controller: StocksController;
    let service: StocksService;

    const stockDto: GetStockDto = {
        ticker: 'BBAS3',
        companyId: 2,
        freeFloat: '24.79',
        tagAlong: '100',
        avgDailyLiquidity: 408911000,
    };

    const mockStocksService = {
        getAllStocks: jest.fn().mockResolvedValue([stockDto]),
        getStock: jest.fn().mockResolvedValue(stockDto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StocksController],
            providers: [
                {
                    provide: StocksService,
                    useValue: mockStocksService,
                },
            ],
        }).compile();

        controller = module.get<StocksController>(StocksController);
        service = module.get<StocksService>(StocksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllStocks', () => {
        it('should return an array of stock DTOs', async () => {
            const result = await controller.getAllStocks();
            expect(result).toEqual([stockDto]);
            expect(service.getAllStocks).toHaveBeenCalled();
        });
    });

    describe('getStock', () => {
        it('should return a stock DTO', async () => {
            const id = '1';
            const result = await controller.getStock(id);
            expect(result).toEqual(stockDto);
            expect(service.getStock).toHaveBeenCalledWith(id);
        });
    });
});
