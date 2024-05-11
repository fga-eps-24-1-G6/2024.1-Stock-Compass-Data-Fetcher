import { Controller, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { GetCompanyDto } from './companies.dtos';

@Controller('company')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Get()
  getAllCompanies(): Promise<GetCompanyDto[]> {
    return this.companiesService.getAllCompanies();
  }

  @Get(':id')
  getCompany(@Param('id') id: string): Promise<GetCompanyDto> {
    return this.companiesService.getCompany(id);
  }
}
