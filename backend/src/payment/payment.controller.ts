import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  BadRequestException,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // User: Add Method
  @Post('methods/:userId')
  addMethod(@Param('userId') userId: string, @Body() body: any) {
    console.log('Adding payment method for:', userId, body);
    return this.paymentService.addPaymentMethod(userId, body);
  }

  // User: Get Methods
  @Get('methods/:userId')
  getMethods(@Param('userId') userId: string) {
    return this.paymentService.getPaymentMethods(userId);
  }

  @Get('balance/:userId')
  getBalance(@Param('userId') userId: string) {
    // Default currency USD for now, or make query param
    return {
      balance: this.paymentService.getBalance(userId, 'USD'),
      currency: 'USD',
    };
  }

  // Admin: Get All Methods
  @Get('admin/methods')
  getAllMethods() {
    return this.paymentService.getAllPaymentMethods();
  }

  // Admin: Suspend/Activate Method
  @Put('admin/method/:methodId/status')
  toggleStatus(
    @Param('methodId') methodId: string,
    @Body('status') status: 'active' | 'suspended',
  ) {
    return this.paymentService.toggleMethodStatus(methodId, status);
  }

  // Utility: Exchange Rate & Convert
  @Post('exchange-rate')
  getExchangeRate(@Body() body: { amount: number; from: string; to: string }) {
    return this.paymentService.calculateExchange(
      body.amount,
      body.from,
      body.to,
    );
  }

  @Post('exchange')
  async exchange(
    @Body() body: { userId: string; amount: number; from: string; to: string },
  ) {
    try {
      return await this.paymentService.exchangeFunds(
        body.userId,
        body.amount,
        body.from,
        body.to,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // --- Transactions & Withdrawals ---
  @Post('deposit')
  deposit(
    @Body()
    body: {
      userId: string;
      amount: number;
      methodId: string;
      currency: string;
    },
  ) {
    return this.paymentService.depositFunds(
      body.userId,
      body.amount,
      body.methodId,
      body.currency,
    );
  }

  @Post('withdraw')
  withdraw(
    @Body()
    body: {
      userId: string;
      amount: number;
      methodId: string;
      currency: string;
    },
  ) {
    return this.paymentService.requestWithdrawal(
      body.userId,
      body.amount,
      body.methodId,
      body.currency,
    );
  }

  @Get('transactions/:userId')
  getTransactions(@Param('userId') userId: string) {
    return this.paymentService.getTransactions(userId);
  }

  @Get('admin/transactions')
  getAllTransactions() {
    return this.paymentService.getAllTransactions();
  }


  // Admin: Withdrawal Management
  @Get('admin/withdrawals')
  getWithdrawalRequests() {
    return this.paymentService.getWithdrawalRequests();
  }

  @Post('admin/withdrawal/:id')
  processWithdrawal(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'reject'; note?: string },
  ) {
    return this.paymentService.processWithdrawalRequest(
      id,
      body.action,
      body.note,
    );
  }

  // --- Gateway Management ---
  @Get('admin/gateways')
  getSystemGateways() {
    return this.paymentService.getSystemGateways();
  }

  @Post('admin/gateways')
  addSystemGateway(@Body() body: any) {
    console.log('Adding Gateway via PaymentController:', body);
    return this.paymentService.addSystemGateway(body);
  }

  @Post('admin/gateways/:id/delete')
  removeSystemGateway(@Param('id') id: string) {
    return this.paymentService.removeSystemGateway(id);
  }
  // --------------------------

  // -----------------------------------------------------

  // Admin: Power Controls
  @Post('admin/global/toggle')
  toggleGlobal(@Body() body: { type: 'stripe' | 'bkash'; enabled: boolean }) {
    return this.paymentService.toggleGlobalMethod(body.type, body.enabled);
  }

  @Post('admin/balance/adjust')
  adjustBalance(
    @Body()
    body: {
      userId: string;
      amount: number;
      type: 'add' | 'subtract';
      currency: string;
      reason: string;
    },
  ) {
    return this.paymentService.adminAdjustBalance(
      body.userId,
      body.amount,
      body.type,
      body.currency,
      body.reason,
    );
  }

  // --- Treasury Management Endpoints ---

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/treasury')
  getTreasuryStats(@Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin Access Only');
    return this.paymentService.getTreasuryStats();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin/treasury/lock')
  setSystemLock(@Body() body: { locked: boolean }, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin Access Only');
    console.log('Admin Panic Lock Request:', body);
    return this.paymentService.setSystemLock(body.locked);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin/treasury/deposit')
  adminDeposit(@Body() body: { amount: number; currency: string; note: string }, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin Access Only');
    return this.paymentService.adminDeposit(body.amount, body.currency, body.note);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin/treasury/withdraw')
  adminWithdraw(@Body() body: { amount: number; currency: string; method: string }, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin Access Only');
    return this.paymentService.adminWithdraw(body.amount, body.currency, body.method);
  }

  // --- Referral Settings ---
  @Get('admin/referral-settings')
  getReferralSettings() {
    return this.paymentService.getReferralSettings();
  }

  @Post('admin/referral-settings')
  updateReferralSettings(@Body() body: any) {
    return this.paymentService.updateReferralSettings(body);
  }
}
