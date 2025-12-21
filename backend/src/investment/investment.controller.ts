import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { InvestmentService } from './investment.service';

@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  // Worker Endpoints
  @Post('proposal')
  createProposal(@Body() body: any) {
    return this.investmentService.createProposal(body);
  }

  @Get('worker/:id')
  getWorkerProposals(@Param('id') id: string) {
    return this.investmentService.getWorkerProposals(id);
  }

  // Investor Endpoints
  @Get('marketplace')
  getAllProposals(@Query('userId') userId: string) {
    return this.investmentService.getAllProposals(userId);
  }

  @Post('fund')
  fundProject(
    @Body()
    body: {
      proposalId: string;
      investorId: string;
      amount: number;
      waiver: boolean;
      ndaSigned: boolean;
    },
  ) {
    return this.investmentService.fundProject(
      body.proposalId,
      body.investorId,
      body.amount,
      body.waiver,
      body.ndaSigned,
    );
  }

  @Post('nda/sign')
  signNDA(
    @Body()
    body: {
      proposalId: string;
      userId: string;
      type?: 'NDA' | 'WAIVER' | 'CONTRACT';
    },
  ) {
    return this.investmentService.signNDA(
      body.proposalId,
      body.userId,
      body.type,
    );
  }

  @Post('kyc/verify')
  verifyKYC(@Body() body: { userId: string }) {
    return this.investmentService.verifyKYC(body.userId);
  }

  @Get('legal/templates')
  getLegalTemplates() {
    return this.investmentService.getLegalTemplates();
  }

  // Admin Endpoints
  @Get('admin/nda-audit')
  getNDAAuditLog() {
    return this.investmentService.getSignedAgreements();
  }

  @Get('admin/dashboard')
  getDashboardStats() {
    return this.investmentService.getFinancialStats();
  }

  @Get('settings')
  getSettings() {
    return this.investmentService.getSettings();
  }

  @Put('settings/commission')
  updateCommission(@Body('rate') rate: number) {
    return this.investmentService.updateSettings(rate);
  }

  @Post('milestone/release')
  releaseMilestone(@Body() body: { proposalId: string; milestoneId: string }) {
    return this.investmentService.releaseMilestone(
      body.proposalId,
      body.milestoneId,
    );
  }
}
