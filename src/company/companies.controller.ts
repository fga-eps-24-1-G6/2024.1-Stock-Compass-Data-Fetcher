import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './company.interface';
import { CreateCompanyDto, UpdateCompanyDto } from './companies.dtos';

@Controller('company')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Get()
  getAllCompanies(): Promise<Company[]> {
    return this.companiesService.getAllCompanies();
  }

  @Get(':id')
  getCompany(@Param('id') id: string): Promise<Company> {
    return this.companiesService.getCompany(id);
  }

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Patch(':id')
  updateCompany(@Req() req): Promise<Company> {
    const { id } = req.params;
    const updateCompanyDto = req.body as UpdateCompanyDto;

    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  deleteCompany(@Param('id') id: string) {
    this.companiesService.deleteCompany(id);
  }
}
