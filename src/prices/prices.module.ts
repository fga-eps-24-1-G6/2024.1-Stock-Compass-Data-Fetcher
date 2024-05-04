import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { PricesController } from "./prices.controller";
import { PricesService } from "./prices.service";
import { PriceDrizzleRepository } from "./repositories/price.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [PricesController],
    providers: [PricesService, PriceDrizzleRepository],
    exports: [PriceDrizzleRepository]
})
export class PriceModule { }