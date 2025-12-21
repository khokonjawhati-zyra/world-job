import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentConfigService } from './payment-config.service';

@Controller('payment-config')
export class PaymentConfigController {
    constructor(private readonly configService: PaymentConfigService) { }

    @Get()
    async getConfig() {
        // Return masked config for UI
        return this.configService.getConfig(false);
    }

    @Post()
    async saveConfig(@Body() config: any) {
        // In real app, check for Admin Role Guard here
        return this.configService.saveConfig(config);
    }
}
