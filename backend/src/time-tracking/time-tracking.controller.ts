import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';

@Controller('time-tracking')
export class TimeTrackingController {
  constructor(private readonly timeService: TimeTrackingService) {}

  @Post('start')
  startTime(
    @Body() body: { jobId: string; workerId: string; hourlyRate: number },
  ) {
    return this.timeService.startTime(
      body.jobId,
      body.workerId,
      body.hourlyRate,
    );
  }

  @Post('stop')
  stopTime(@Body() body: { workerId: string }) {
    return this.timeService.stopTime(body.workerId);
  }

  @Get('job/:jobId')
  getJobLogs(@Param('jobId') jobId: string) {
    return this.timeService.getLogsByJob(jobId);
  }

  @Get('worker/:workerId')
  getWorkerLogs(@Param('workerId') workerId: string) {
    return this.timeService.getLogsByWorker(workerId);
  }

  @Post('approve/:logId')
  approveLog(@Param('logId') logId: string) {
    return this.timeService.approveLog(logId);
  }

  @Get('active/:workerId')
  getActiveTimer(@Param('workerId') workerId: string) {
    return this.timeService.getActiveTimer(workerId);
  }
}
