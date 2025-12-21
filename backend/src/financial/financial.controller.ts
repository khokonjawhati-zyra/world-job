import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { Invoice, Payout } from './financial.model';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('invoices')
  getInvoices() {
    return this.financialService.getInvoices();
  }

  @Get('payouts')
  getPayouts() {
    return this.financialService.getPayouts();
  }

  @Get('report')
  getReport(@Query('period') period: string) {
    return this.financialService.getFinancialReport(period || 'current');
  }

  @Post('payout')
  requestPayout(
    @Body()
    body: {
      workerId: string;
      amount: number;
      method: 'STRIPE' | 'BKASH';
    },
  ) {
    return this.financialService.processPayout(
      body.workerId,
      body.amount,
      body.method,
    );
  }

  @Post('invoice')
  createInvoice(@Body() body: Partial<Invoice>) {
    return this.financialService.createInvoice(body);
  }
}
