import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { GatewayController } from './gateway.controller';
import { ConfigModule } from '@nestjs/config';
import { FinancialModule } from '../financial/financial.module';

import { SecurityModule } from '../security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, FinancialModule, SecurityModule, AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule { }
