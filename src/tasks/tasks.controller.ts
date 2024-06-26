import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('populate')
  populate() {
    this.tasksService.populate();
  }

  @Get('dividends')
  fetchNewDividends() {
    return this.tasksService.fetchNewDividends();
  }

  @Get('prices')
  fetchNewPrices() {
    this.tasksService.fetchNewPrices();
  }

  @Get('balance_sheets')
  fetchNewBalanceSheets() {
    this.tasksService.fetchNewBalanceSheets();
  }
}
