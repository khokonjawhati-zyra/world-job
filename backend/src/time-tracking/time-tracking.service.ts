import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TimeLog } from './time-log.model';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class TimeTrackingService {
  constructor(private paymentService: PaymentService) { }

  private timeLogs: TimeLog[] = [];

  // Mock active timers: map workerId -> activeLogId
  private activeTimers: Map<string, string> = new Map();

  startTime(jobId: string, workerId: string, hourlyRate: number): TimeLog {
    if (this.activeTimers.has(workerId)) {
      throw new BadRequestException('Worker already has an active timer');
    }

    const id = Math.random().toString(36).substring(7);
    const log = new TimeLog(id, jobId, workerId, hourlyRate);

    this.timeLogs.push(log);
    this.activeTimers.set(workerId, id);

    return log;
  }

  stopTime(workerId: string): TimeLog {
    const logId = this.activeTimers.get(workerId);
    if (!logId) {
      throw new NotFoundException('No active timer found for this worker');
    }

    const log = this.timeLogs.find((l) => l.id === logId);
    if (!log) {
      this.activeTimers.delete(workerId);
      throw new NotFoundException('Log entry not found');
    }

    log.endTime = new Date();
    const diffMs = log.endTime.getTime() - log.startTime.getTime();
    log.durationMinutes = Math.floor(diffMs / 60000); // Minutes

    // Calculate cost: (minutes / 60) * hourlyRate
    log.totalCost = parseFloat(
      ((log.durationMinutes / 60) * log.hourlyRate).toFixed(2),
    );
    log.status = 'PENDING_APPROVAL';

    this.activeTimers.delete(workerId);
    return log;
  }

  getLogsByJob(jobId: string): TimeLog[] {
    return this.timeLogs
      .filter((l) => l.jobId === jobId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  getLogsByWorker(workerId: string): TimeLog[] {
    return this.timeLogs
      .filter((l) => l.workerId === workerId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async approveLog(logId: string): Promise<TimeLog> {
    const log = this.timeLogs.find((l) => l.id === logId);
    if (!log) throw new NotFoundException('Log not found');

    if (log.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Log is not pending approval');
    }

    // Integrate with Escrow System via PaymentService
    // Integrate with Escrow System via PaymentService
    await this.paymentService.distributeEscrow(
      log.jobId,
      log.totalCost || 0,
      'USD',
      log.workerId,
    );

    log.status = 'PAID';
    return log;
  }

  getActiveTimer(workerId: string): TimeLog | null {
    const logId = this.activeTimers.get(workerId);
    if (!logId) return null;
    return this.timeLogs.find((l) => l.id === logId) || null;
  }
}
