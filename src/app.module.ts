import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { StockModule } from './stocks/stocks.module';
import { PriceModule } from './prices/prices.module';
import { DividendModule } from './dividends/dividends.module';
import { BalanceSheetModule } from './balanceSheets/balanceSheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CompanyModule,
    StockModule,
    PriceModule,
    DividendModule,
    BalanceSheetModule
  ],
})
export class AppModule {}
