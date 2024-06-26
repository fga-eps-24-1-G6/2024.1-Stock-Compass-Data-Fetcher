import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { BalanceSheetsController } from "./balanceSheets.controller";
import { BalanceSheetsService } from "./balanceSheets.service";
import { BalanceSheetDrizzleRepository } from "./repositories/balanceSheet.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [BalanceSheetsController],
    providers: [BalanceSheetsService, { provide: 'BalanceSheetRepository', useClass: BalanceSheetDrizzleRepository }],
    exports: [{ provide: 'BalanceSheetRepository', useClass: BalanceSheetDrizzleRepository }]
})
export class BalanceSheetModule { }