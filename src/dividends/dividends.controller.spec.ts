import { Test, TestingModule } from '@nestjs/testing';
import { DividendsController } from './dividends.controller';
import { DividendsService } from './dividends.service';
import { GetDividendDto } from './dividends.dtos';

describe('DividendsController', () => {
  let controller: DividendsController;
  let service: DividendsService;

  const dividendDto: GetDividendDto = {
    stockId: 1,
    value: 5.0,
    ownershipDate: new Date('2023-05-06'),
    paymentDate: new Date('2023-05-20'),
    type: '',
  };

  const mockDividendService = {
    getAllDividends: jest.fn().mockResolvedValue([dividendDto]),
    getStockDividends: jest.fn().mockResolvedValue([dividendDto]), // Adicionado mock para getStockPrices
    getDividend: jest.fn().mockResolvedValue(dividendDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DividendsController],
      providers: [
        {
          provide: DividendsService,
          useValue: mockDividendService,
        },
      ],
    }).compile();

    controller = module.get<DividendsController>(DividendsController);
    service = module.get<DividendsService>(DividendsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDividends', () => {
    it('should return a dividend DTO when stockId is provided', async () => {
      const stockId = '1';
      const result = await controller.getDividends(stockId);
      expect(result).toEqual([dividendDto]); // Ajuste aqui
      expect(service.getStockDividends).toHaveBeenCalledWith(stockId);
    });

    it('should return an array of dividends DTOs when stockId is not provided', async () => {
      const result = await controller.getDividends(undefined); // Simulando que stockId não foi fornecido
      expect(result).toEqual([dividendDto]); // Manter essa verificação, já que o serviço retorna um array
      expect(service.getAllDividends).toHaveBeenCalled();
    });
  });

  describe('getDividend', () => {
    it('should return a dividend DTO', async () => {
      const id = '1';
      const result = await controller.getDividend(id);
      expect(result).toEqual(dividendDto);
      expect(service.getDividend).toHaveBeenCalledWith(id);
    });
  });
});
