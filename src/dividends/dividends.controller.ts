import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { Dividend } from './dividend.interface';
import { CreateDividendDto, UpdateDividendDto } from './dividends.dtos';

@Controller('dividend')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) { }

  @Get()
  getAllDividends(): Promise<Dividend[]> {
    return this.dividendsService.getAllDividends();
  }

  @Get(':id')
  getDividend(@Param('id') id: string): Promise<Dividend> {
    return this.dividendsService.getDividend(id);
  }

  @Post()
  createDividend(@Body() createDividendDto: CreateDividendDto): Promise<Dividend> {
    return this.dividendsService.createDividend(createDividendDto);
  }

  @Patch(':id')
  updateDividend(@Req() req): Promise<Dividend> {
    const { id } = req.params;
    const updateDividendDto = req.body as UpdateDividendDto;

    return this.dividendsService.updateDividend(id, updateDividendDto);
  }

  @Delete(':id')
  deleteDividend(@Param('id') id: string) {
    this.dividendsService.deleteDividend(id);
  }
}
