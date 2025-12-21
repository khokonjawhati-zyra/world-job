import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [FinancialModule],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
