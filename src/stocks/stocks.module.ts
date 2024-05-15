import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { StocksController } from "./stocks.controller";
import { StocksService } from "./stocks.service";
import { StockDrizzleRepository } from "./repositories/stock.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [StocksController],
    providers: [
        StocksService,
        {
            provide: 'StockRepository',
            useClass: StockDrizzleRepository,
        },
    ],
    exports: [{
        provide: 'StockRepository',
        useClass: StockDrizzleRepository,
    },]
})
export class StockModule { }