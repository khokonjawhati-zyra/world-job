import { Controller, Get, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('heatmap')
  getHeatmap() {
    return this.analyticsService.getDemandHeatmap();
  }

  @Get('fraud-alerts')
  getFraudAlerts() {
    return this.analyticsService.getFraudAlerts();
  }

  @Post('predict-risk')
  predictRisk(@Body() data: any) {
    return this.analyticsService.analyzeRisk(data);
  }
}
