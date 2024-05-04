import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { StocksController } from "./stocks.controller";
import { StocksService } from "./stocks.service";
import { StockDrizzleRepository } from "./repositories/stock.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [StocksController],
    providers: [StocksService, StockDrizzleRepository],
    exports: [StockDrizzleRepository]
})
export class StockModule { }