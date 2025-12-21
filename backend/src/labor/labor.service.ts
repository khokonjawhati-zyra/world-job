import { Injectable, NotFoundException } from '@nestjs/common';
import { LaborJob, AttendanceRecord } from './labor.model';

@Injectable()
export class LaborService {
  private jobs: LaborJob[] = [];
  private attendanceRecords: AttendanceRecord[] = [];

  // --- Job Management ---

  createJob(employerId: string, data: any): LaborJob {
    const id = 'job_' + Math.random().toString(36).substr(2, 9);
    const newJob = new LaborJob(
      id,
      employerId,
      data.title,
      data.description,
      data.location,
      new Date(data.date),
      data.shiftStart,
      data.shiftEnd,
      data.vacancies || 1,
      0,
      data.wage,
      data.category,
      'open',
      [],
      [],
    );
    this.jobs.push(newJob);
    return newJob;
  }

  getAllJobs(): LaborJob[] {
    return this.jobs;
  }

  getJobsByEmployer(employerId: string): LaborJob[] {
    return this.jobs.filter((job) => job.employerId === employerId);
  }

  getJobById(id: string): LaborJob {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  // --- Hiring Flow ---

  applyForJob(jobId: string, workerId: string) {
    const job = this.getJobById(jobId);
    if (job.status !== 'open') throw new Error('Job is no longer open');
    if (!job.applicants.includes(workerId)) {
      job.applicants.push(workerId);
    }
    return { success: true, message: 'Applied successfully' };
  }

  hireWorker(jobId: string, workerId: string) {
    const job = this.getJobById(jobId);
    if (job.hiredWorkers.length >= job.vacancies)
      throw new Error('No vacancies left');

    if (!job.hiredWorkers.includes(workerId)) {
      job.hiredWorkers.push(workerId);
      job.hiredCount++;

      // Create initial attendance record
      this.createAttendanceRecord(jobId, workerId);
    }

    if (job.hiredCount >= job.vacancies) {
      job.status = 'filled';
    }

    return job;
  }

  // --- Attendance & Proof ---

  private createAttendanceRecord(jobId: string, workerId: string) {
    const id = 'att_' + Math.random().toString(36).substr(2, 9);
    const record = new AttendanceRecord(id, jobId, workerId, 'pending');
    this.attendanceRecords.push(record);
  }

  getAttendance(jobId: string, workerId?: string) {
    if (workerId) {
      return this.attendanceRecords.find(
        (r) => r.jobId === jobId && r.workerId === workerId,
      );
    }
    return this.attendanceRecords.filter((r) => r.jobId === jobId);
  }

  getAllAttendanceRecords() {
    return this.attendanceRecords;
  }

  checkIn(jobId: string, workerId: string) {
    const record = this.attendanceRecords.find(
      (r) => r.jobId === jobId && r.workerId === workerId,
    );
    if (!record) throw new NotFoundException('Attendance record not found');

    record.status = 'checked-in';
    record.checkInTime = new Date();
    return record;
  }

  checkOut(jobId: string, workerId: string, proofs: string[] = []) {
    const record = this.attendanceRecords.find(
      (r) => r.jobId === jobId && r.workerId === workerId,
    );
    if (!record) throw new NotFoundException('Attendance record not found');

    record.status = 'checked-out';
    record.checkOutTime = new Date();
    if (proofs.length > 0) record.proofMedia = proofs;
    return record;
  }

  // 1. Employer Approves -> Sets to Pending Payment (Waiting for Admin)
  approveAndPay(jobId: string, workerId: string) {
    const record = this.attendanceRecords.find(
      (r) => r.jobId === jobId && r.workerId === workerId,
    );
    if (!record) throw new NotFoundException('Attendance record not found');

    record.status = 'pending_payment';
    return {
      success: true,
      message: `Worker ${workerId} approved. Waiting for Admin verification.`,
    };
  }

  // 2. Admin Releases -> Triggers Pay
  adminReleasePayment(jobId: string, workerId: string) {
    const record = this.attendanceRecords.find(
      (r) => r.jobId === jobId && r.workerId === workerId,
    );
    if (!record) throw new NotFoundException('Attendance record not found');
    if (record.status !== 'pending_payment')
      throw new Error('Record is not pending payment');

    record.status = 'paid';
    // Connect to PaymentService here in real app

    return {
      success: true,
      message: `Payment Released for Worker ${workerId}`,
    };
  }

  getAllPendingPayments() {
    return this.attendanceRecords.filter((r) => r.status === 'pending_payment');
  }
}
