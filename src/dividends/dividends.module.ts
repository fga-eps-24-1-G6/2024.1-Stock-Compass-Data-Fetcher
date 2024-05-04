import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { DividendsController } from "./dividends.controller";
import { DividendsService } from "./dividends.service";
import { DividendDrizzleRepository } from "./repositories/dividend.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [DividendsController],
    providers: [DividendsService, DividendDrizzleRepository],
    exports: [DividendDrizzleRepository]
})
export class DividendModule { }