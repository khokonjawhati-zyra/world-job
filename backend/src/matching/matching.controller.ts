import { Controller, Post, Body } from '@nestjs/common';
import { MatchingService } from './matching.service';
import type { JobPost, WorkerProfile } from './matching.service';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('workers')
  findWorkersForJob(@Body() job: JobPost) {
    return this.matchingService.getRecommendedWorkers(job);
  }

  @Post('jobs')
  findJobsForWorker(@Body() worker: WorkerProfile) {
    return this.matchingService.getRecommendedJobs(worker);
  }

  @Post('proposal')
  generateProposal(@Body() body: { jobId: number; workerId: number }) {
    return this.matchingService.generateProposal(body.jobId, body.workerId);
  }

  @Post('pricing')
  getPricingRecommendation(@Body() job: Partial<JobPost>) {
    return this.matchingService.getPricingRecommendation(job);
  }
}
