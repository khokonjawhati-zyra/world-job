import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  findAll() {
    return this.supportService.findAll();
  }

  @Post()
  createTicket(
    @Body()
    body: {
      userId: string;
      userType: 'worker' | 'employer' | 'investor';
      subject: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      disputeId?: string;
    },
  ) {
    return this.supportService.createTicket(
      body.userId,
      body.userType,
      body.subject,
      body.description,
      body.priority,
      body.disputeId,
    );
  }

  @Patch(':id/resolve')
  resolveTicket(@Param('id') id: string) {
    return this.supportService.resolveTicket(id);
  }
}
