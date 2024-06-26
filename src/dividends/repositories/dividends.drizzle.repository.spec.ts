import { Test, TestingModule } from '@nestjs/testing';
import { DividendDrizzleRepository } from './dividend.drizzle.repository';
import { Dividend } from '../dividend.interface';
import { CreateDividendDto, UpdateDividendDto } from '../dividends.dtos';
import { dividends } from '../../db/schema';

describe('DividendDrizzleRepository', () => {
  let repository: DividendDrizzleRepository;
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
        DividendDrizzleRepository,
        {
          provide: 'DrizzelProvider',
          useValue: dbMock,
        },
      ],
    }).compile();

    repository = module.get<DividendDrizzleRepository>(
      DividendDrizzleRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a dividend by id', async () => {
      const dividend: Dividend = {
        id: 1,
        stockId: 2,
        type: 'JSCP',
        value: 0.741,
        ownershipDate: new Date('2023-12-28'),
        paymentDate: new Date('2024-02-20'),
      };
      dbMock.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce([dividend]),
        }),
      });

      const result = await repository.findOne(1);
      expect(result).toEqual(dividend);
      expect(dbMock.select).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all dividends', async () => {
      const dividend: Dividend = {
        id: 1,
        stockId: 2,
        type: 'JSCP',
        value: 0.741,
        ownershipDate: new Date('2023-12-28'),
        paymentDate: new Date('2024-02-20'),
      };
      dbMock.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce([dividend]),
      });

      const result = await repository.findAll();
      expect(result).toEqual([dividend]);
      expect(dbMock.select).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new dividend', async () => {
      const createDividendDto: CreateDividendDto = {
        stockId: 2,
        type: 'JSCP',
        value: 0.741,
        ownershipDate: new Date('2023-12-28'),
        paymentDate: new Date('2024-02-20'),
      };

      const dividendCreated: Dividend = {
        id: 1,
        stockId: 2,
        type: 'JSCP',
        value: 0.741,
        ownershipDate: new Date('2023-12-28'),
        paymentDate: new Date('2024-02-20'),
      };

      dbMock.insert.mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockReturnValueOnce([dividendCreated]),
        }),
      });

      const result = await repository.create(createDividendDto);
      expect(result).toEqual(dividendCreated);
      expect(dbMock.insert).toHaveBeenCalledWith(dividends);
    });
  });

  describe('createMultiple', () => {
    it('should create multiple dividends', async () => {
      const createDividendDto: CreateDividendDto[] = [
        {
          stockId: 1,
          value: 5.0, // Alterado para uma string
          ownershipDate: new Date('2023-05-06'),
          paymentDate: new Date('2023-05-20'),
        },
      ];

      const dividend = {
        id: 1,
        value: createDividendDto[0].value, // Convertido para string antes de parseFloat
        ownershipDate: new Date(createDividendDto[0].ownershipDate),
        paymentDate: new Date(createDividendDto[0].paymentDate),
        stockId: createDividendDto[0].stockId,
      } as Dividend;

      dbMock.insert.mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockReturnValueOnce([dividend]),
        }),
      });

      // Chame a função createMultiple com os dados de exemplo
      const result = await repository.createMultiple(createDividendDto);

      // Verifique se o resultado da função corresponde aos dividendos simulados
      expect(result).toEqual([dividend]);

      expect(dbMock.insert).toHaveBeenCalledWith(dividends);
    });
  });

  describe('findByStock', () => {
    it('should return a dividend by stock', async () => {
      const stockId = 1;
      const dividends: Dividend[] = [
        {
          stockId: 1,
          value: 5.0, // Alterado para uma string
          ownershipDate: new Date('2023-05-06'),
          paymentDate: new Date('2023-05-20'),
          id: 0,
          type: '',
        },
      ];
      dbMock.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce(dividends),
        }),
      });

      const result = await repository.findByStock(stockId);
      expect(result).toEqual(dividends);
      expect(dbMock.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a dividend by id', async () => {
      const updateDividendDto: UpdateDividendDto = {};
      const dividend: Dividend = {
        id: 1,
        stockId: 2,
        type: 'JSCP',
        value: 0.741,
        ownershipDate: new Date('2023-12-28'),
        paymentDate: new Date('2024-02-20'),
      };

      dbMock.update.mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockReturnValueOnce([dividend]),
          }),
        }),
      });

      const result = await repository.update(1, updateDividendDto);
      expect(result).toEqual(dividend);
      expect(dbMock.update).toHaveBeenCalledWith(dividends);
    });
  });

  describe('delete', () => {
    it('should delete a dividend by id', async () => {
      dbMock.delete.mockReturnValueOnce({ where: jest.fn() });

      await repository.delete(1);
      expect(dbMock.delete).toHaveBeenCalledWith(dividends);
    });
  });

  describe('deleteAll', () => {
    it('should delete all stocks', async () => {
      await repository.deleteAll();
      expect(dbMock.delete).toHaveBeenCalledWith(dividends);
    });
  });
});
