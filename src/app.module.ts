import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { StockModule } from './stocks/stocks.module';
import { PriceModule } from './prices/prices.module';
import { DividendModule } from './dividends/dividends.module';
import { BalanceSheetModule } from './balanceSheets/balanceSheets.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    CompanyModule,
    StockModule,
    PriceModule,
    DividendModule,
    BalanceSheetModule
  ],
})
export class AppModule { }
