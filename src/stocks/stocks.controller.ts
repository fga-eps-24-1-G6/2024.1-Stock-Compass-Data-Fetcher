import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { GetStockDto } from './stocks.dtos';

@Controller('stock')
export class StocksController {
  constructor(private readonly stocksService: StocksService) { }

  @Get()
  getAllStocks(): Promise<GetStockDto[]> {
    return this.stocksService.getAllStocks();
  }

  @Get(':id')
  getStock(@Param('id') id: string): Promise<GetStockDto> {
    return this.stocksService.getStock(id);
  }
}
