import { Test, TestingModule } from '@nestjs/testing';
import { StockDrizzleRepository } from './stock.drizzle.repository';
import { Stock } from '../stock.interface';
import { CreateStockDto, UpdateStockDto } from '../stocks.dtos';
import { stocks } from '../../db/schema';

describe('StockDrizzleRepository', () => {
    let repository: StockDrizzleRepository;
    let dbMock: any;

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
                StockDrizzleRepository,
                {
                    provide: 'DrizzelProvider',
                    useValue: dbMock,
                },
            ],
        }).compile();

        repository = module.get<StockDrizzleRepository>(StockDrizzleRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a stock by id', async () => {
            const stock = {
                id: 1,
                ticker: 'BBAS3',
                externalId: '2',
                companyId: 2,
                freeFloat: '24.79',
                tagAlong: '100',
                avgDailyLiquidity: 408911000,
            } as Stock;
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([stock])
                })
            });

            const result = await repository.findOne(1);
            expect(result).toEqual(stock);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all stocks', async () => {
            const stock = {
                id: 1,
                ticker: 'BBAS3',
                externalId: '2',
                companyId: 2,
                freeFloat: '24.79',
                tagAlong: '100',
                avgDailyLiquidity: 408911000,
            } as Stock;
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce([stock])
            });

            const result = await repository.findAll();
            expect(result).toEqual([stock]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findByTicker', () => {
        it('should return a stock by ticker', async () => {
            const stock = {
                id: 1,
                ticker: 'BBAS3',
                externalId: '2',
                companyId: 2,
                freeFloat: '24.79',
                tagAlong: '100',
                avgDailyLiquidity: 408911000,
            } as Stock;
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([stock])
                })
            });

            const result = await repository.findByTicker('BBAS3');
            expect(result).toEqual(stock);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new stock', async () => {
            const createStockDto = {
                ticker: 'BBAS3',
                externalId: '2',
                companyId: 2,
                freeFloat: '24.79',
                tagAlong: '100',
                avgDailyLiquidity: 408911000,
            } as CreateStockDto;
            const stock = { id: 1, ...createStockDto } as Stock;
            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([stock])
                }),
            });

            const result = await repository.create(createStockDto);
            expect(result).toEqual(stock);
            expect(dbMock.insert).toHaveBeenCalledWith(stocks);
        });
    });

    describe('update', () => {
        it('should update a stock by id', async () => {
            const updateStockDto = { freeFloat: '75' } as UpdateStockDto;
            const stock = {
                id: 1,
                ticker: 'BBAS3',
                externalId: '2',
                companyId: 2,
                freeFloat: '24.79',
                tagAlong: '100',
                avgDailyLiquidity: 408911000,
            } as Stock;
            dbMock.update.mockReturnValueOnce({
                set: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce({
                        returning: jest.fn().mockReturnValueOnce([stock])
                    }),
                })
            });

            const result = await repository.update(1, updateStockDto);
            expect(result).toEqual(stock);
            expect(dbMock.update).toHaveBeenCalledWith(stocks);
        });
    });

    describe('delete', () => {
        it('should delete a stock by id', async () => {
            dbMock.delete.mockReturnValueOnce({ where: jest.fn() });

            await repository.delete(1);
            expect(dbMock.delete).toHaveBeenCalledWith(stocks);
        });
    });

    describe('deleteAll', () => {
        it('should delete all stocks', async () => {
            await repository.deleteAll();
            expect(dbMock.delete).toHaveBeenCalledWith(stocks);
        });
    });
});
