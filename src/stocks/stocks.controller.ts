import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from './stock.interface';
import { CreateStockDto, UpdateStockDto } from './stocks.dtos';

@Controller('stock')
export class StocksController {
  constructor(private readonly stocksService: StocksService) { }

  @Get()
  getAllStocks(): Promise<Stock[]> {
    return this.stocksService.getAllStocks();
  }

  @Get(':id')
  getStock(@Param('id') id: string): Promise<Stock> {
    return this.stocksService.getStock(id);
  }

  @Post()
  createStock(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stocksService.createStock(createStockDto);
  }

  @Patch(':id')
  updateStock(@Req() req): Promise<Stock> {
    const { id } = req.params;
    const updateStockDto = req.body as UpdateStockDto;

    return this.stocksService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  deleteStock(@Param('id') id: string) {
    this.stocksService.deleteStock(id);
  }
}
