import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment/admin/gateways')
export class GatewayController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get()
    getGateways() {
        return this.paymentService.getSystemGateways();
    }

    @Post()
    addGateway(@Body() body: any) {
        return this.paymentService.addSystemGateway(body);
    }

    @Post(':id/delete')
    removeGateway(@Param('id') id: string) {
        return this.paymentService.removeSystemGateway(id);
    }
}
