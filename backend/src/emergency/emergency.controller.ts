import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { EmergencyService } from './emergency.service';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('alert')
  createAlert(@Body() createAlertDto: any) {
    return this.emergencyService.createAlert(createAlertDto);
  }

  @Get('active')
  getActiveEmergencies() {
    return this.emergencyService.getActiveEmergencies();
  }

  @Post('deploy')
  deployWorkers(@Body() deploymentDto: any) {
    return this.emergencyService.deployWorkers(deploymentDto);
  }

  @Get('tracking')
  getTrackingData() {
    return this.emergencyService.getTrackingData();
  }
}
