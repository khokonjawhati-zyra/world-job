import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { GlobalWorkPermitService } from './global-work-permit.service';
import { JobType } from './work-permit.model';

@Controller('work-permit')
export class GlobalWorkPermitController {
  constructor(private readonly workPermitService: GlobalWorkPermitService) {}

  @Post('create')
  async createPermit(@Body() body: any) {
    const { jobId, jobType, buyerId, workerId, totalAmount, currency } = body;

    if (!jobId || !buyerId || !workerId || !totalAmount) {
      throw new BadRequestException('Missing required fields');
    }

    // Validate JobType
    if (!Object.values(JobType).includes(jobType)) {
      // Default to FUTURE or handle error? Allow flexible for now or error.
      // throw new BadRequestException('Invalid Job Type');
    }

    return this.workPermitService.createPermit(
      jobId,
      jobType,
      buyerId,
      workerId,
      Number(totalAmount),
      currency || 'USD',
    );
  }

  @Get('all')
  async getAllPermits() {
    return this.workPermitService.getAllPermits();
  }

  @Get('user/:role/:userId')
  async getPermitsByUser(
    @Param('role') role: 'BUYER' | 'WORKER',
    @Param('userId') userId: string,
  ) {
    return this.workPermitService.getPermitsByUser(userId, role);
  }

  @Get(':id')
  async getPermit(@Param('id') id: string) {
    return this.workPermitService.getPermitById(id);
  }

  @Put(':id/details')
  async updatePermitDetails(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; userId: string },
  ) {
    return this.workPermitService.updatePermitDetails(id, body, body.userId);
  }

  @Post(':id/buyer-review')
  async buyerReview(
    @Param('id') id: string,
    @Body() body: { decision: 'APPROVE' | 'REJECT'; userId: string },
  ) {
    return this.workPermitService.submitBuyerReview(
      id,
      body.decision,
      body.userId,
    );
  }

  @Post(':id/admin-approve')
  async adminApprove(
    @Param('id') id: string,
    @Body() body: { decision: 'APPROVE' | 'REJECT' },
  ) {
    // In real app, check Admin Role Guard
    return this.workPermitService.adminFinalApproval(id, body.decision);
  }

  @Post(':id/dispute')
  async raiseDispute(
    @Param('id') id: string,
    @Body() body: { reason: string; actorId: string },
  ) {
    return this.workPermitService.raiseDispute(id, body.reason, body.actorId);
  }

  @Post(':id/resolve-dispute')
  async resolveDispute(
    @Param('id') id: string,
    @Body()
    body: {
      resolution: 'RELEASE_TO_WORKER' | 'REFUND_BUYER' | 'SPLIT';
      splitWorkerAmount?: number;
    },
  ) {
    return this.workPermitService.resolveDispute(
      id,
      body.resolution,
      body.splitWorkerAmount,
    );
  }

  @Post(':id/release-payment')
  async releasePayment(@Param('id') id: string) {
    return this.workPermitService.releasePayment(id);
  }

  @Post(':id/submit-work')
  async submitWork(
    @Param('id') id: string,
    @Body() body: { proof: string; workerId: string },
  ) {
    return this.workPermitService.submitWork(id, body.proof, body.workerId);
  }
}
