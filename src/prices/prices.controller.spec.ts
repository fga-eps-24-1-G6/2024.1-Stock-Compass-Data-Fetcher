import { Test, TestingModule } from '@nestjs/testing';
import { PricesController } from './prices.controller';
import { PricesService} from './prices.service';
import { GetPriceDto } from './prices.dtos';

describe('PricesController', () => {
    let controller: PricesController;
    let service: PricesService;

    const priceDto: GetPriceDto = {
        stockId: 2,
        value: 16.004263214671,
        priceDate: new Date('2023-05-06'),
    };

    const mockPricesService = {
        getAllPrices: jest.fn().mockResolvedValue([priceDto]),
        getStockPrices: jest.fn().mockResolvedValue([priceDto]), // Adicionado mock para getStockPrices
        getPrice: jest.fn().mockResolvedValue(priceDto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PricesController],
            providers: [
                {
                    provide: PricesService,
                    useValue: mockPricesService,
                },
            ],
        }).compile();

        controller = module.get<PricesController>(PricesController);
        service = module.get<PricesService>(PricesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getPrices', () => {
        it('should return an array of prices DTOs when stockId is provided', async () => {
            const stockId = '1'; // Definindo um stockId válido para o teste
            const result = await controller.getPrices(stockId);
            expect(result).toEqual([priceDto]);
            expect(service.getStockPrices).toHaveBeenCalledWith(stockId);
        });

        it('should return an array of prices DTOs when stockId is not provided', async () => {
            const result = await controller.getPrices(undefined); // Simulando que stockId não foi fornecido
            expect(result).toEqual([priceDto]);
            expect(service.getAllPrices).toHaveBeenCalled();
        });
    });

    describe('getPrice', () => {
        it('should return a price DTO', async () => {
            const id = '1';
            const result = await controller.getPrice(id);
            expect(result).toEqual(priceDto);
            expect(service.getPrice).toHaveBeenCalledWith(id);
        });
    });
});
