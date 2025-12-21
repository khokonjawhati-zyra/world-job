import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { WorkerRequestService } from './worker-request.service';

@Controller('worker-requests')
export class WorkerRequestController {
  constructor(private readonly service: WorkerRequestService) {}

  @Post()
  create(
    @Body()
    body: {
      workerId: string;
      title: string;
      description: string;
      preferredRate: number;
      skills: string[];
    },
  ) {
    return this.service.create(body.workerId, body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('worker/:workerId')
  findByWorker(@Param('workerId') workerId: string) {
    return this.service.findByWorker(workerId);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }
}
