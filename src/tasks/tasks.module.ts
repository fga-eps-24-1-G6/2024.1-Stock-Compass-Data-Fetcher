import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { StockModule } from 'src/stocks/stocks.module';
import { BalanceSheetModule } from 'src/balanceSheets/balanceSheets.module';
import { CompanyModule } from 'src/company/company.module';
import { DividendModule } from 'src/dividends/dividends.module';
import { PriceModule } from 'src/prices/prices.module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { TasksProcessor } from './tasks.processor';

@Module({
    imports: [
        CompanyModule,
        StockModule,
        PriceModule,
        DividendModule,
        BalanceSheetModule,
        HttpModule,
        BullModule.registerQueue({
            name: 'register',
        }),
    ],
    controllers: [TasksController],
    providers: [TasksService, TasksProcessor],
})
export class TasksModule { }
