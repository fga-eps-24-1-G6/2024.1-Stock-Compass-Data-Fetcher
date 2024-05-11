import { Controller, Get, Param, Query } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { GetDividendDto } from './dividends.dtos';

@Controller('dividend')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) { }

  @Get()
  getDividends(@Query('stockId') id: string): Promise<GetDividendDto[]> {
    if (id) return this.dividendsService.getStockDividends(id);

    return this.dividendsService.getAllDividends();
  }

  @Get(':id')
  getDividend(@Param('id') id: string): Promise<GetDividendDto> {
    return this.dividendsService.getDividend(id);
  }
}
