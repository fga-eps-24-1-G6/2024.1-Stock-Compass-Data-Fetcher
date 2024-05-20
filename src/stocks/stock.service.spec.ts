import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { CreateStockDto, GetStockDto, UpdateStockDto } from './stocks.dtos';
import { Stock } from './stock.interface';
import { StockRepository } from './repositories/stock.repository';

describe('StocksService', () => {
    let service: StocksService;
    let repository: StockRepository;

    const stock: Stock = {
        id: 1,
        ticker: 'BBAS3',
        externalId: '2',
        companyId: 2,
        freeFloat: '24.79',
        tagAlong: '100',
        avgDailyLiquidity: 408911000,
    };

    const mockStockRepository = {
        findOne: jest.fn().mockResolvedValue(stock),
        findAll: jest.fn().mockResolvedValue([stock]),
        create: jest.fn().mockResolvedValue(stock),
        update: jest.fn().mockResolvedValue(stock),
        delete: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StocksService,
                {
                    provide: 'StockRepository',
                    useValue: mockStockRepository,
                }
            ],
        }).compile();

        service = module.get<StocksService>(StocksService);
        repository = module.get<StockRepository>('StockRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getStock', () => {
        const getStockDto: GetStockDto = {
            ticker: 'BBAS3',
            companyId: 2,
            freeFloat: '24.79',
            tagAlong: '100',
            avgDailyLiquidity: 408911000,
        };

        it('should return a stock DTO', async () => {
            const result = await service.getStock('1');
            expect(result).toEqual(getStockDto);
            expect(repository.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllStocks', () => {
        const getStockDto: GetStockDto = {
            ticker: 'BBAS3',
            companyId: 2,
            freeFloat: '24.79',
            tagAlong: '100',
            avgDailyLiquidity: 408911000,
        };

        it('should return an array of stock DTOs', async () => {
            const result = await service.getAllStocks();
            expect(result).toEqual([getStockDto]);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe('createStock', () => {
        const createStockDto: CreateStockDto = {
            ticker: 'BBAS3',
            externalId: '2',
            companyId: 2,
            freeFloat: '24.79',
            tagAlong: '100',
            avgDailyLiquidity: 408911000,
        };

        it('should create a new stock', async () => {
            const result = await service.createStock(createStockDto);
            expect(result).toEqual(stock);
            expect(repository.create).toHaveBeenCalledWith(createStockDto);
        });
    });

    describe('updateStock', () => {
        const updateStockDto: UpdateStockDto = {
            freeFloat: '65',
        };

        it('should update a stock', async () => {
            const result = await service.updateStock('1', updateStockDto);
            expect(result).toEqual(stock);
            expect(repository.update).toHaveBeenCalledWith(1, updateStockDto);
        });
    });

    describe('deleteStock', () => {
        it('should delete a stock', async () => {
            await service.deleteStock('1');
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
