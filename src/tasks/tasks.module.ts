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
import { TasksRegisterProcessor } from './processors/tasks.register.processor';
import { TasksNewPriceProcessor } from './processors/tasks.newPrice.processor';
import { TasksNewDividendsProcessor } from './processors/tasks.newDividends.processor';
import { TasksNewBalanceSheetsProcessor } from './processors/tasks.newBalanceSheets.processor';

@Module({
    imports: [
        CompanyModule,
        StockModule,
        PriceModule,
        DividendModule,
        BalanceSheetModule,
        HttpModule,
        BullModule.registerQueue(
            { name: 'register' },
            { name: 'new_price' },
            { name: 'new_dividends' },
            { name: 'new_balance_sheets' }
        ),
    ],
    controllers: [TasksController],
    providers: [
        TasksService,
        TasksRegisterProcessor,
        TasksNewPriceProcessor,
        TasksNewDividendsProcessor,
        TasksNewBalanceSheetsProcessor
    ],
})
export class TasksModule { }
