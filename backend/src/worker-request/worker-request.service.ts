import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkerRequest } from './worker-request.model';

@Injectable()
export class WorkerRequestService {
  private requests: WorkerRequest[] = [];

  create(workerId: string, data: any): WorkerRequest {
    const id = 'req_' + Math.random().toString(36).substr(2, 9);
    const newReq = new WorkerRequest(
      id,
      workerId,
      data.title,
      data.description,
      data.preferredRate,
      data.skills,
    );
    this.requests.push(newReq);
    return newReq;
  }

  findAll(): WorkerRequest[] {
    return this.requests;
  }

  findByWorker(workerId: string): WorkerRequest[] {
    return this.requests.filter((req) => req.workerId === workerId);
  }

  toggleStatus(id: string): WorkerRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException('Request not found');
    req.status = req.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    return req;
  }
}
