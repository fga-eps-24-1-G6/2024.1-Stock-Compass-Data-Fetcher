import { Controller, Get, Param, Query } from '@nestjs/common';
import { BalanceSheetsService } from './balanceSheets.service';
import { GetBalanceSheetDto } from './balanceSheets.dtos';

@Controller('balanceSheet')
export class BalanceSheetsController {
  constructor(private readonly balanceSheetsService: BalanceSheetsService) { }

  @Get()
  getAllBalanceSheets(@Query('companyId') id?: string): Promise<GetBalanceSheetDto[]> {
    if (id) return this.balanceSheetsService.getCompanyBalanceSheets(id);

    return this.balanceSheetsService.getAllBalanceSheets();
  }

  @Get(':id')
  getBalanceSheet(@Param('id') id: string): Promise<GetBalanceSheetDto> {
    return this.balanceSheetsService.getBalanceSheet(id);
  }
}
