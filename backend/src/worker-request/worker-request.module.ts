import { Module } from '@nestjs/common';
import { WorkerRequestController } from './worker-request.controller';
import { WorkerRequestService } from './worker-request.service';

@Module({
  controllers: [WorkerRequestController],
  providers: [WorkerRequestService],
  exports: [WorkerRequestService],
})
export class WorkerRequestModule {}
