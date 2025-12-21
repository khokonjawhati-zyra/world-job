import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { LaborService } from './labor.service';

@Controller('labor')
export class LaborController {
  constructor(private readonly laborService: LaborService) {}

  // Employer: Post a generic/daily job
  @Post('jobs')
  createJob(@Body() body: { employerId: string; data: any }) {
    return this.laborService.createJob(body.employerId, body.data);
  }

  @Get('jobs')
  getAllJobs() {
    return this.laborService.getAllJobs();
  }

  @Get('jobs/employer/:id')
  getEmployerJobs(@Param('id') id: string) {
    return this.laborService.getJobsByEmployer(id);
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.laborService.getJobById(id);
  }

  // Worker: Apply
  @Post('jobs/:id/apply')
  apply(@Param('id') id: string, @Body('workerId') workerId: string) {
    return this.laborService.applyForJob(id, workerId);
  }

  // Employer: Hire
  @Post('jobs/:id/hire')
  hire(@Param('id') id: string, @Body('workerId') workerId: string) {
    return this.laborService.hireWorker(id, workerId);
  }

  // Attendance
  @Get('attendance/:jobId')
  getAttendance(@Param('jobId') jobId: string) {
    return this.laborService.getAttendance(jobId);
  }

  @Get('admin/attendance/all')
  getAllAttendance() {
    return this.laborService.getAllAttendanceRecords();
  }

  @Post('attendance/:jobId/check-in')
  checkIn(@Param('jobId') jobId: string, @Body('workerId') workerId: string) {
    return this.laborService.checkIn(jobId, workerId);
  }

  @Post('attendance/:jobId/check-out')
  checkOut(
    @Param('jobId') jobId: string,
    @Body() body: { workerId: string; proofs: string[] },
  ) {
    return this.laborService.checkOut(jobId, body.workerId, body.proofs);
  }

  @Post('attendance/:jobId/approve')
  approveAndPay(
    @Param('jobId') jobId: string,
    @Body('workerId') workerId: string,
  ) {
    return this.laborService.approveAndPay(jobId, workerId);
  }

  @Get('admin/pending-payments')
  getPendingPayments() {
    return this.laborService.getAllPendingPayments();
  }

  @Post('admin/release-payment/:jobId/:workerId')
  adminReleasePayment(
    @Param('jobId') jobId: string,
    @Param('workerId') workerId: string,
  ) {
    return this.laborService.adminReleasePayment(jobId, workerId);
  }
}
