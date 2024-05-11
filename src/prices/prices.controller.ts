import { Controller, Get, Param, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPriceDto } from './prices.dtos';

@Controller('price')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Get()
  getPrices(@Query('stockId') id: string): Promise<GetPriceDto[]> {
    if (id)
      return this.pricesService.getStockPrices(id);
    
    return this.pricesService.getAllPrices();
  }

  @Get(':id')
  getPrice(@Param('id') id: string): Promise<GetPriceDto> {
    return this.pricesService.getPrice(id);
  }
}
