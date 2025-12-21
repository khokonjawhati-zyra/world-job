import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AiAdminService } from './ai-admin.service';

@Controller('ai-admin')
export class AiAdminController {
  constructor(private readonly aiService: AiAdminService) {}

  @Get('priority-queue')
  getQueue() {
    return this.aiService.getWorkloadPriority();
  }

  @Post('analyze/payment/:id')
  analyzePayment(@Param('id') id: string) {
    return this.aiService.analyzePaymentRelease(id);
  }

  @Post('analyze/dispute/:id')
  analyzeDispute(@Param('id') id: string) {
    return this.aiService.analyzeDispute(id);
  }
}
