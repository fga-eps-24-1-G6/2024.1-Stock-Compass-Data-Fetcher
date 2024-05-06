import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from './price.interface';
import { CreatePriceDto, UpdatePriceDto } from './prices.dtos';

@Controller('price')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Get()
  getAllPrices(): Promise<Price[]> {
    return this.pricesService.getAllPrices();
  }

  @Get(':id')
  getPrice(@Param('id') id: string): Promise<Price> {
    return this.pricesService.getPrice(id);
  }

  @Get()
  getStockPrices(@Query('stockId') id: string): Promise<Price[]> {
    return this.pricesService.getStockPrices(id);
  }

  @Post()
  createPrice(@Body() createPriceDto: CreatePriceDto): Promise<Price> {
    const result = this.pricesService.createPrice(createPriceDto);
    return result
  }

  @Patch(':id')
  updatePrice(@Req() req): Promise<Price> {
    const { id } = req.params;
    const updatePriceDto = req.body as UpdatePriceDto;

    return this.pricesService.updatePrice(id, updatePriceDto);
  }

  @Delete(':id')
  deletePrice(@Param('id') id: string) {
    this.pricesService.deletePrice(id);
  }
}
