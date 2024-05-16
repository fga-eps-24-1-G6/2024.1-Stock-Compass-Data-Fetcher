/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PriceDrizzleRepository } from './price.drizzle.repository';
import { Price } from '../price.interface';
//import { CreatePriceDto,UpdatePriceDto } from '../prices.dtos';
import { prices } from '../../db/schema';

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
            dbMock.select.mockReturnValueOnce(prices); // Ajuste para retornar diretamente o array de preços
    
            const result = await repository.findAll();
            expect(result).toEqual(prices);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });
    
    describe('findByStock', () => {
        it('should return a price by stock', async () => {
            const prices: Price[] = [
                {
                    id: 1,
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ];
            dbMock.select.mockReturnValueOnce(prices); // Ajuste para retornar diretamente o array de preços
    
            const result = await repository.findByStock(2); 
            expect(result).toEqual(prices[0]);
            expect(dbMock.select).toHaveBeenCalled();
        });
    });

    /* Fiquei um pouco confuso na hora do select porque nao consegui pensar em como fariamos juntando tabelas
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

            const result = await repository.findLatest('2023-05-06'); 
            expect(result).toEqual(prices);
            expect(dbMock.select).toHaveBeenCalled();
        });
    }); */
     

    /*
    describe('create', () => {
        it('should create a new price', async () => {
            const prices: Price[] = [
                {
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ] as CreatePriceDto;
            const price = { id: 1, ...createPriceDto } as Price;
            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([price])
                }),
            });

            const result = await repository.create(createPriceDto);
            expect(result).toEqual(price);
            expect(dbMock.insert).toHaveBeenCalledWith(price);
        });
    }); 
    */

     /*
    describe('createMultiple', () => {
        it('should create a multiples prices', async () => {
            const prices: Price[] = [
                {
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ] as CreatePriceDto;
            const price = { id: 1, ...createPriceDto } as Price;
            dbMock.insert.mockReturnValueOnce({
                values: jest.fn().mockReturnValueOnce({
                    returning: jest.fn().mockReturnValueOnce([price])
                }),
            });

            const result = await repository.create(createPriceDto);
            expect(result).toEqual(price);
            expect(dbMock.insert).toHaveBeenCalledWith(price);
        });
    }); 
    
    describe('update', () => {
        it('should update a price by id', async () => {
            const updatePriceDto = { freeFloat: '75' } as UpdatePriceDto;
            const prices: Price[] = [
                {
                    stockId: 2,
                    value: 16.004263214671,
                    priceDate: new Date('2023-05-06'),
                }
            ] as Price;
            dbMock.update.mockReturnValueOnce({
                set: jest.fn().mockReturnValueOnce({
                    where: jest.fn().mockReturnValueOnce({
                        returning: jest.fn().mockReturnValueOnce([prices])
                    }),
                })
            });

            const result = await repository.update(1, updatePriceDto);
            expect(result).toEqual(prices);
            expect(dbMock.update).toHaveBeenCalledWith(prices);
        });
    });

*/

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
