/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PriceDrizzleRepository } from './price.drizzle.repository';
import { Price } from '../price.interface';
//import { CreatePriceDto,UpdatePriceDto } from '../prices.dtos';
import { prices } from '../../db/schema';
import { CreatePriceDto, UpdatePriceDto } from '../prices.dtos';

describe('PriceDrizzleRepository', () => {
    let repository: PriceDrizzleRepository;
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
            execute: jest.fn().mockReturnThis(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PriceDrizzleRepository,
                {
                    provide: 'DrizzelProvider',
                    useValue: dbMock,
                },
            ],
        }).compile();

        repository = module.get<PriceDrizzleRepository>(PriceDrizzleRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
    describe('findOne', () => {
        it('should return a price by id', async () => {
            const prices: Price[] = [
                {
                    id: 1,
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ];

            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce(prices)
                })
            });

            const result = await repository.findOne(2);
            expect(result).toEqual(prices[0]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all prices', async () => {
            const prices: Price[] = [
                {
                    id: 1,
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ];
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce(prices)
            });

            const result = await repository.findAll();
            expect(result).toEqual(prices);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    describe('findByStock', () => {
        it('should return a price by stock', async () => {
            const stockId = 2;
            const prices: Price[] = [
                {
                    id: 1,
                    stockId: stockId,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ];
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce(prices)
                })
            });

            const result = await repository.findByStock(stockId);
            expect(result).toEqual(prices);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });


    describe('findLatest', () => {
        it('should return a latest price', async () => {
            const prices: Price[] = [
                {
                    id: 1,
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ];
            dbMock.select.mockReturnValueOnce({
                from: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce([prices])
                })
            });

            await repository.findLatest();
            expect(dbMock.execute).toHaveBeenCalled();
        });
    });



    describe('create', () => {
        it('should create a new price', async () => {
            const createPriceDto: CreatePriceDto =
            {
                stockId: 2,
                value: '16.004263214671',
                priceDate: '2023-05-06',
            }
                ;
            const price = { id: 1, value: parseFloat(createPriceDto.value), priceDate: new Date(createPriceDto.priceDate), stockId: createPriceDto.stockId } as Price;
            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([price])
                }),
            });

            const result = await repository.create(createPriceDto);
            expect(result).toEqual(price);
            expect(dbMock.insert).toHaveBeenCalledWith(prices);
        });
    });



    describe('createMultiple', () => {
        it('should create a multiples prices', async () => {
            const createPriceDto: CreatePriceDto[] = [
                {
                    stockId: 2,
                    value: '16.004263214671',
                    priceDate: '2023-05-06',
                }
            ];
            const price = { id: 1, value: parseFloat(createPriceDto[0].value), priceDate: new Date(createPriceDto[0].priceDate), stockId: createPriceDto[0].stockId } as Price;
            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([price])
                }),
            });

            const result = await repository.createMultiple(createPriceDto);
            expect(result).toEqual([price]);
            expect(dbMock.insert).toHaveBeenCalledWith(prices);
        });
    });

    describe('update', () => {
        it('should update a price by id', async () => {
            const updatePriceDto = { value: '75' } as UpdatePriceDto;
            const pricesData: Price = 
                {
                    id: 1,
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate:new Date ('2023-05-06'),
                };
            dbMock.update.mockReturnValueOnce({
                set: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce({
                        returning: jest.fn().mockReturnValueOnce([pricesData])
                    }),
                })
            });

            const result = await repository.update(1, updatePriceDto);
            expect(result).toEqual(pricesData);
            expect(dbMock.update).toHaveBeenCalledWith(prices);
        });
    });



    describe('delete', () => {
        it('should delete a price by id', async () => {
            dbMock.delete.mockReturnValueOnce({ where: jest.fn() });

            await repository.delete(1);
            expect(dbMock.delete).toHaveBeenCalledWith(prices);
        });
    });

    describe('deleteAll', () => {
        it('should delete all prices', async () => {
            await repository.deleteAll();
            expect(dbMock.delete).toHaveBeenCalledWith(prices);
        });
    });
});
