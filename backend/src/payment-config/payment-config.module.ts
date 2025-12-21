import { Module } from '@nestjs/common';
import { PaymentConfigController } from './payment-config.controller';
import { PaymentConfigService } from './payment-config.service';
import { SecurityModule } from '../security/security.module';

@Module({
    imports: [SecurityModule],
    controllers: [PaymentConfigController],
    providers: [PaymentConfigService],
    exports: [PaymentConfigService],
})
export class PaymentConfigModule { }
