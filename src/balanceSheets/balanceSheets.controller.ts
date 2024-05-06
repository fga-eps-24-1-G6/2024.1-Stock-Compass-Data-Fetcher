import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BalanceSheetsService } from './balanceSheets.service';
import { BalanceSheet } from './balanceSheet.interface';
import { CreateBalanceSheetDto, UpdateBalanceSheetDto } from './balanceSheets.dtos';

@Controller('balanceSheet')
export class BalanceSheetsController {
  constructor(private readonly balanceSheetsService: BalanceSheetsService) { }

  @Get()
  getAllBalanceSheets(): Promise<BalanceSheet[]> {
    return this.balanceSheetsService.getAllBalanceSheets();
  }

  @Get(':id')
  getBalanceSheet(@Param('id') id: string): Promise<BalanceSheet> {
    return this.balanceSheetsService.getBalanceSheet(id);
  }

  @Get()
  getBalanceSheetsFromCompany(@Query('companyId') id: string): Promise<BalanceSheet[]> {
    return this.balanceSheetsService.getBalanceSheetsFromCompany(id);
  }

  @Post()
  createBalanceSheet(@Body() createBalanceSheetDto: CreateBalanceSheetDto): Promise<BalanceSheet> {
    return this.balanceSheetsService.createBalanceSheet(createBalanceSheetDto);
  }

  @Patch(':id')
  updateBalanceSheet(@Req() req): Promise<BalanceSheet> {
    const { id } = req.params;
    const updateBalanceSheetDto = req.body as UpdateBalanceSheetDto;

    return this.balanceSheetsService.updateBalanceSheet(id, updateBalanceSheetDto);
  }

  @Delete(':id')
  deleteBalanceSheet(@Param('id') id: string) {
    this.balanceSheetsService.deleteBalanceSheet(id);
  }
}
