import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get(':workerId')
  getIdentity(@Param('workerId') workerId: string) {
    return this.identityService.getIdentity(workerId);
  }

  @Post('verify')
  verifyIdentity(@Body() body: { workerId: string }) {
    return this.identityService.verifyIdentity(body.workerId);
  }

  @Post('admin/status')
  updateStatus(
    @Body()
    body: {
      workerId: string;
      status: 'verified' | 'suspended';
      riskScore: number;
    },
  ) {
    return this.identityService.setRiskStatus(
      body.workerId,
      body.status,
      body.riskScore,
    );
  }
}
