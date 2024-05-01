import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CompanyModule
  ],
})
export class AppModule {}
