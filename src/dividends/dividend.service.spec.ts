import { Test, TestingModule } from '@nestjs/testing';
import { DividendsService } from './dividends.service';
import {
  CreateDividendDto,
  GetDividendDto,
  UpdateDividendDto,
} from './dividends.dtos';
import { Dividend } from './dividend.interface';
import { DividendRepository } from './repositories/dividend.repository';

describe('DividendsService', () => {
  let service: DividendsService;
  let repository: DividendRepository;

  const dividend: Dividend = {
    id: 1,
    stockId: 2,
    type: 'JSCP',
    value: 0.741,
    ownershipDate: new Date('2023-12-28'),
    paymentDate: new Date('2024-02-20'),
  };

  const mockDividendRepository = {
    findOne: jest.fn().mockResolvedValue(dividend),
    findAll: jest.fn().mockResolvedValue([dividend]),
    create: jest.fn().mockResolvedValue(dividend),
    update: jest.fn().mockResolvedValue(dividend),
    delete: jest.fn().mockResolvedValue(undefined),
    deleteAll: jest.fn().mockResolvedValue(undefined),
    findAllGroupedByStock: jest.fn().mockResolvedValue(undefined),
    findByStock: jest.fn().mockResolvedValue([dividend]),
    createMultiple: jest.fn().mockResolvedValue([dividend]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DividendsService,
        {
          provide: 'DividendRepository',
          useValue: mockDividendRepository,
        },
      ],
    }).compile();

    service = module.get<DividendsService>(DividendsService);
    repository = module.get<DividendRepository>('DividendRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDividend', () => {
    const getDividendDto: GetDividendDto = {
      stockId: 2,
      type: 'JSCP',
      value: 0.741,
      ownershipDate: new Date('2023-12-28'),
      paymentDate: new Date('2024-02-20'),
    };

    it('should return a dividend DTO', async () => {
      const result = await service.getDividend('1');
      expect(result).toEqual(getDividendDto);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllDividends', () => {
    const getDividendDto: GetDividendDto = {
      stockId: 2,
      value: 0.741,
      ownershipDate: new Date('2023-12-28'),
      paymentDate: new Date('2024-02-20'),
      type: 'JSCP',
    };

    it('should return an array of dividends DTOs', async () => {
      const result = await service.getAllDividends();
      expect(result).toEqual([getDividendDto]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('createDividend', () => {
    const createDividendDto: CreateDividendDto = {
      stockId: 1,
      value: 5.0,
      ownershipDate: new Date('2023-05-06'),
      paymentDate: new Date('2023-05-20'),
      type: '',
    };

    it('should create a new dividend', async () => {
      const result = await service.createDividend(createDividendDto);
      expect(result).toEqual(dividend);
      expect(repository.create).toHaveBeenCalledWith(createDividendDto);
    });
  });

  describe('updateDividend', () => {
    const updateDividendDto: UpdateDividendDto = {
      value: 65,
    };

    it('should update a dividend', async () => {
      const result = await service.updateDividend('2', updateDividendDto);
      expect(result).toEqual(dividend);
      expect(repository.update).toHaveBeenCalledWith(2, updateDividendDto);
    });
  });

  describe('deleteDividend', () => {
    it('should delete a dividend', async () => {
      await service.deleteDividend('2');
      expect(repository.delete).toHaveBeenCalledWith(2);
    });
  });
});
