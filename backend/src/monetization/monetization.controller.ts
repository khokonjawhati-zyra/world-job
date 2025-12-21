import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { MonetizationService } from './monetization.service';

@Controller('monetization')
export class MonetizationController {
  constructor(private readonly monetizationService: MonetizationService) {}

  @Get('plans')
  getPlans(@Query('role') role: 'worker' | 'employer') {
    return this.monetizationService.getPlans(role);
  }

  @Get('ads')
  getAds(@Query('role') role: string) {
    return this.monetizationService.getAds(role);
  }

  @Post('boost')
  boost(@Body() body: any) {
    return this.monetizationService.boostContent(
      body.id,
      body.type,
      body.amount,
    );
  }

  @Get('all-plans')
  getAllPlans() {
    return this.monetizationService.getAllPlans();
  }

  @Post('plans/:id')
  updatePlan(@Param('id') id: string, @Body() updates: any) {
    return this.monetizationService.updatePlan(id, updates);
  }

  @Post('create-plan')
  createPlan(@Body() plan: any) {
    return this.monetizationService.createPlan(plan);
  }

  @Post('delete-plan/:id')
  deletePlan(@Param('id') id: string) {
    return this.monetizationService.deletePlan(id);
  }

  @Post('subscribe')
  subscribe(@Body() body: any) {
    return this.monetizationService.subscribe(body.userId, body.planId);
  }

  @Get('subscription/:userId')
  getSubscription(@Param('userId') userId: string) {
    return this.monetizationService.getSubscription(userId);
  }
}
