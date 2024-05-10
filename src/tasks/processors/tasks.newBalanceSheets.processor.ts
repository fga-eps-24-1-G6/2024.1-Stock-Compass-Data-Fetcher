import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { catchError, map } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { BalanceSheetRepository } from 'src/balanceSheets/repositories/balanceSheet.repository';
import { BalanceSheetDrizzleRepository } from 'src/balanceSheets/repositories/balanceSheet.drizzle.repository';
import { handleFetchNewBalanceSheets } from '../handlers/balanceSheet.handler';

@Processor('new_balance_sheets')
export class TasksNewBalanceSheetsProcessor {
    constructor(
        @Inject(BalanceSheetDrizzleRepository) private readonly balanceSheetRepository: BalanceSheetRepository,
        private readonly httpService: HttpService,
    ) { }

    private readonly logger = new Logger(TasksNewBalanceSheetsProcessor.name);

    @Process()
    async handleFetchNewSheets(job: Job) {
        const company = job.data;

        this.logger.debug(`Start fetching balance sheets of ${company.name}...`);

        const url = `${process.env.SCRAPER_BASE_URL}/api/balancos/balancoresultados/chart/${company.externalId}/10/quarterly/`

        const response = this.httpService.get(url).pipe(
            map((response) => response.data),
            catchError((error) => {
                this.logger.error(error.message);
                return null;
            })
        )


        const sheetData = await lastValueFrom(response);
        if (!sheetData) {
            this.logger.warn(`Company ${company.name}'s balance sheets fetch returned null`);
            return;
        }

        const { newBalanceSheets, error } = handleFetchNewBalanceSheets(sheetData, {
            year: company.balanceSheetYear,
            quarter: company.balanceSheetQuarter,
        }, company.companyId);

        if (error) {
            this.logger.debug(`Failed to create balance sheets for company ${company.name} with error: ${error}`);
            return;
        }

        if (!newBalanceSheets.length) {
            this.logger.debug(`Found no new balance sheets for company ${company.name}`);
            return;
        }

        await this.balanceSheetRepository.createMultiple(newBalanceSheets);

        this.logger.debug(`New balance sheets of ${company.name} added successfully with value: ${newBalanceSheets}`);
        this.logger.debug(`${company.name} fetching completed`);
    }
}