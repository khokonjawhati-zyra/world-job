export class TimeLog {
  id: string;
  jobId: string;
  workerId: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  hourlyRate: number;
  totalCost?: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'APPROVED' | 'PAID';

  constructor(id: string, jobId: string, workerId: string, hourlyRate: number) {
    this.id = id;
    this.jobId = jobId;
    this.workerId = workerId;
    this.hourlyRate = hourlyRate;
    this.startTime = new Date();
    this.status = 'ACTIVE';
  }
}
