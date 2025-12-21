import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationRequest } from './verification.model';

@Injectable()
export class VerificationService {
  private requests: VerificationRequest[] = [];

  // Mock initial data
  constructor() {
    this.requests.push(
      new VerificationRequest(
        'v1',
        '101',
        'WORKER',
        'IDENTITY',
        'http://example.com/id.jpg',
        'PENDING',
        new Date(),
      ),
      new VerificationRequest(
        'v2',
        '201',
        'EMPLOYER',
        'EMAIL',
        'employer@company.com',
        'PENDING',
        new Date(),
      ),
    );
  }

  submitRequest(
    userId: string,
    userType: 'WORKER' | 'EMPLOYER' | 'INVESTOR',
    type: 'IDENTITY' | 'PHONE' | 'EMAIL',
    data: string,
  ): VerificationRequest {
    const id = 'req_' + Math.random().toString(36).substr(2, 9);
    const request = new VerificationRequest(
      id,
      userId,
      userType,
      type,
      data,
      'PENDING',
      new Date(),
    );
    this.requests.push(request);
    return request;
  }

  getPendingRequests(): VerificationRequest[] {
    return this.requests
      .filter((req) => req.status === 'PENDING')
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  getRequestsByUser(userId: string): VerificationRequest[] {
    return this.requests.filter((req) => req.userId === userId);
  }

  approveRequest(id: string): VerificationRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException('Request not found');
    req.status = 'APPROVED';
    return req;
  }

  rejectRequest(id: string): VerificationRequest {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException('Request not found');
    req.status = 'REJECTED';
    return req;
  }

  // Helper to check if a user is verified (e.g., has approved IDENTITY)
  isUserVerified(userId: string): boolean {
    return this.requests.some(
      (r) =>
        r.userId === userId && r.type === 'IDENTITY' && r.status === 'APPROVED',
    );
  }
}
