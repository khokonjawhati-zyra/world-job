import { Module } from '@nestjs/common';
import { GlobalWorkPermitController } from './global-work-permit.controller';
import { GlobalWorkPermitService } from './global-work-permit.service';
import { PaymentModule } from '../payment/payment.module'; // Import PaymentModule

@Module({
  imports: [PaymentModule],
  controllers: [GlobalWorkPermitController],
  providers: [GlobalWorkPermitService],
  exports: [GlobalWorkPermitService],
})
export class GlobalWorkPermitModule {}
