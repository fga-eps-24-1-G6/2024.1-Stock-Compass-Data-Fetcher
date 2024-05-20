import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";
import { CompanyDrizzleRepository } from "./repositories/company.drizzle.repository";

@Module({
    imports: [DrizzleModule],
    controllers: [CompaniesController],
    providers: [CompaniesService, { provide: 'CompanyRepository', useClass: CompanyDrizzleRepository }],
    exports: [{ provide: 'CompanyRepository', useClass: CompanyDrizzleRepository }]
})
export class CompanyModule { }