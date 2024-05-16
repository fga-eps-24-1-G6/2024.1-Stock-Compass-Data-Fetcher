import { Test, TestingModule } from '@nestjs/testing';
import { PricesService } from './prices.service';
import { CreatePriceDto, GetPriceDto, UpdatePriceDto } from './prices.dtos';
import { Price } from './price.interface';
import { PriceRepository } from './repositories/price.repository';

describe('PricesService', () => {
    let service: PricesService;
    let repository: PriceRepository;

    const price: Price = {
        id: 1,
        stockId: 2,
        value: 16.004263214671,
        priceDate: new Date('2023-05-06'),
    };

    const mockPriceRepository = {
        findOne: jest.fn().mockResolvedValue(price),
        findAll: jest.fn().mockResolvedValue([price]),
        create: jest.fn().mockResolvedValue(price),
        update: jest.fn().mockResolvedValue(price),
        delete: jest.fn().mockResolvedValue(undefined),
        deleteAll: jest.fn().mockResolvedValue(undefined),
        findLatest:jest.fn().mockResolvedValue(undefined),
        findByStock:jest.fn().mockResolvedValue([price]), 
        createMultiple:jest.fn().mockResolvedValue([price]),
       
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PricesService,
                {
                    provide: 'PriceRepository',
                    useValue: mockPriceRepository,
                }
            ],
        }).compile();

        service = module.get<PricesService>(PricesService);
        repository = module.get<PriceRepository>('PriceRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getPrice', () => {
        const getPriceDto: GetPriceDto = {
            
            stockId: 2,
            value: 16.004263214671,
            priceDate: new Date('2023-05-06'),
        };

        it('should return a price DTO', async () => {
            const result = await service.getPrice('1');
            expect(result).toEqual(getPriceDto);
            expect(repository.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllPrices', () => {
        const getPriceDto: GetPriceDto = {
            id: 1,
            stockId: 2,
            value: 16.004263214671,
            priceDate: new Date('2023-05-06'),
        };

        it('should return an array of prices DTOs', async () => {
            const result = await service.getAllPrices();
            expect(result).toEqual([getPriceDto]);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe('createPrice', () => {
        const createPriceDto: CreatePriceDto = {
            id: 1,
            stockId: 2,
            value: 16.004263214671,
            priceDate: new Date('2023-05-06'),
        };

        it('should create a new price', async () => {
            const result = await service.createPrice(createPriceDto);
            expect(result).toEqual(price);
            expect(repository.create).toHaveBeenCalledWith(createPriceDto);
        });
    });

    describe('updatePrice', () => {
        const updatePriceDto: UpdatePriceDto = {
            freeFloat: '65',
        };

        it('should update a price', async () => {
            const result = await service.updatePrice('2', updatePriceDto);
            expect(result).toEqual(price);
            expect(repository.update).toHaveBeenCalledWith(2, updatePriceDto);
        });
    });

    describe('deletePrice', () => {
        it('should delete a price', async () => {
            await service.deletePrice('2');
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
