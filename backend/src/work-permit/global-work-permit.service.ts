import * as fs from 'fs';
import * as path from 'path';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { WorkPermit, PermitStatus, JobType } from './work-permit.model';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class GlobalWorkPermitService {
  private permits: WorkPermit[] = [];
  private readonly logger = new Logger(GlobalWorkPermitService.name);
  private readonly DATA_FILE = path.join(
    process.cwd(),
    'data',
    'work_permits.json',
  );

  constructor(private paymentService: PaymentService) {
    this.loadState();
  }

  private loadState() {
    try {
      if (fs.existsSync(this.DATA_FILE)) {
        const raw = fs.readFileSync(this.DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.permits = data.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          buyerDecisionTime: p.buyerDecisionTime
            ? new Date(p.buyerDecisionTime)
            : undefined,
          auditLogs: p.auditLogs
            ? p.auditLogs.map((l) => ({
              ...l,
              timestamp: new Date(l.timestamp),
            }))
            : [],
        }));
        this.logger.log(`Loaded ${this.permits.length} permits from storage.`);
      } else {
        this.seedData();
        this.saveState();
      }
    } catch (e) {
      this.logger.error(`Failed to load permit state: ${e.message}`);
      this.seedData();
    }
  }

  private saveState() {
    try {
      const dir = path.dirname(this.DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.DATA_FILE, JSON.stringify(this.permits, null, 2));
    } catch (e) {
      this.logger.error(`Failed to save permit state: ${e.message}`);
    }
  }

  private seedData() {
    this.permits = [
      new WorkPermit({
        id: 'wp_mock_01',
        jobId: '105',
        jobType: JobType.AI_MODEL_TRAINING,
        buyerId: '201',
        workerId: '101',
        title: 'AI Model Training - Batch A',
        description:
          'Complete training for 5000 images using the provided dataset. Ensure 98% accuracy.',
        currency: 'USD',
        totalAmount: 1500,
        workerAmount: 1320,
        adminCommission: 150,
        platformFee: 30,
        status: PermitStatus.PENDING_BUYER_REVIEW,
        escrowLocked: true,
        aiRiskScore: 12,
        aiNotes: 'Analysis complete. Low risk. Location consistent.',
        aiVerificationStages: {
          stage1_preCheck: 'PASS',
          stage2_behavior: 'PENDING',
          stage3_adminReview: 'PENDING',
        },
        createdAt: new Date(),
        auditLogs: [],
        updatedAt: new Date(),
      }),
      new WorkPermit({
        id: 'wp_mock_02',
        jobId: '106',
        jobType: JobType.ENTERPRISE,
        buyerId: '202',
        workerId: '103',
        currency: 'USD',
        totalAmount: 5000,
        workerAmount: 4400,
        adminCommission: 500,
        platformFee: 100,
        status: PermitStatus.ACTIVE,
        escrowLocked: true,
        aiRiskScore: 5,
        aiNotes: 'Verified Enterprise Client.',
        aiVerificationStages: {
          stage1_preCheck: 'PASS',
          stage2_behavior: 'NORMAL',
          stage3_adminReview: 'APPROVED',
        },
        createdAt: new Date(),
        auditLogs: [],
        updatedAt: new Date(),
      }),
    ];
  }

  // Helper: Audit Logging (Rule 8)
  private logAudit(
    permitId: string,
    action: string,
    details: string,
    actor: string,
  ) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (permit) {
      if (!permit.auditLogs) permit.auditLogs = [];
      permit.auditLogs.push({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action,
        details,
        actor,
      });
      this.saveState();
    }
  }

  async createPermit(
    jobId: string,
    jobType: JobType,
    buyerId: string,
    workerId: string,
    totalAmount: number,
    currency: string,
  ): Promise<WorkPermit> {
    // ... (Existing calculation logic) ...
    const adminRate = 0.1;
    const platformRate = 0.02;

    const adminCommission = totalAmount * adminRate;
    const platformFee = totalAmount * platformRate;
    const workerAmount = totalAmount - adminCommission - platformFee;

    if (workerAmount <= 0) {
      throw new BadRequestException('Total amount too low to cover fees');
    }

    // Lock Funds
    let lockTxn;
    try {
      const lockResult = await this.paymentService.lockFunds(
        buyerId,
        totalAmount,
        currency,
        `WorkPermit_${jobId}`,
      );
      lockTxn = lockResult.transactionId;
    } catch (error) {
      this.logger.error(
        `Failed to lock funds for job ${jobId}: ${error.message}`,
      );
      throw new BadRequestException(
        'Insufficient Escrow Balance. Buyer must top up.',
      );
    }

    const permit = new WorkPermit({
      id: 'wp_' + Math.random().toString(36).substr(2, 9),
      jobId,
      jobType,
      buyerId,
      workerId,
      currency,
      totalAmount,
      workerAmount,
      adminCommission,
      platformFee,
      escrowLocked: true,
      escrowTransactionId: lockTxn,
      status: PermitStatus.PENDING_AI_CHECK,
      aiRiskScore: 0,
      aiNotes: 'Pending Analysis',
      aiVerificationStages: {
        stage1_preCheck: 'PENDING',
        stage2_behavior: 'PENDING',
        stage3_adminReview: 'PENDING',
      },
      auditLogs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.permits.push(permit);
    this.logAudit(
      permit.id,
      'CREATE_PERMIT',
      `Permit created for Job ${jobId}. Funds Locked: ${totalAmount} ${currency}`,
      'SYSTEM',
    );
    this.logger.log(`📄 Work Permit Created: ${permit.id}`);

    this.runAIPreCheck(permit.id);
    return permit;
  }

  private async runAIPreCheck(permitId: string) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) return;

    // ... (Mock Analysis) ...
    setTimeout(() => {
      const riskScore = Math.floor(Math.random() * 20);
      permit.aiRiskScore = riskScore;
      permit.aiVerificationStages.stage1_preCheck = 'PASS';
      permit.aiNotes = `AI Pre-Check Passed. Risk Score: ${riskScore}/100.`;
      permit.status = PermitStatus.PENDING_BUYER_REVIEW;
      permit.updatedAt = new Date();

      this.logAudit(
        permitId,
        'AI_CHECK_PASS',
        `Risk Score: ${riskScore}`,
        'AI_AGENT',
      );
      this.logger.log(`✅ [AI Stage 1] Passed for ${permitId}`);
    }, 3000);
  }

  async submitBuyerReview(
    permitId: string,
    decision: 'APPROVE' | 'REJECT',
    userId: string,
  ) {
    this.logger.log(
      `Processing Buyer Review for ${permitId} - Decision: ${decision}`,
    );
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');
    if (permit.buyerId !== userId)
      throw new BadRequestException('Not authorized');
    if (permit.status !== PermitStatus.PENDING_BUYER_REVIEW)
      throw new BadRequestException(`Invalid status: ${permit.status}`);

    permit.buyerDecision = decision;
    permit.buyerDecisionTime = new Date();

    this.logAudit(
      permitId,
      'BUYER_REVIEW',
      `Buyer decided: ${decision}`,
      userId,
    );

    // If REJECT, unlock funds immediately and cancel
    if (decision === 'REJECT') {
      try {
        await this.paymentService.unlockFunds(
          permit.buyerId,
          permit.totalAmount,
          permit.currency,
          `Refund_Start_Reject_${permitId}`,
        );
        permit.status = PermitStatus.CANCELLED;
        permit.aiNotes += '\n[Behavior] Buyer rejected startup.';
        this.logAudit(
          permitId,
          'PERMIT_CANCELLED',
          `Permit cancelled by buyer. Funds unlocked: ${permit.totalAmount} ${permit.currency}`,
          userId,
        );
        this.logger.log(`🚫 Permit ${permitId} Rejected & Cancelled by Buyer`);
        return permit;
      } catch (err) {
        this.logger.error(`Failed to unlock funds: ${err.message}`);
        throw new BadRequestException('Failed to process rejection refund');
      }
    }

    // If APPROVE, proceed to AI Behavior Analysis
    await this.runAIBehaviorAnalysis(permitId);
    return permit;
  }

  private async runAIBehaviorAnalysis(permitId: string) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit || permit.status === PermitStatus.CANCELLED) return;

    // Simulate AI Processing Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    permit.aiNotes += '\n[Behavior] Normal approval.';
    permit.aiVerificationStages.stage2_behavior = 'NORMAL';

    // Must set to PENDING_ADMIN_APPROVAL so adminFinalApproval accepts it
    permit.status = PermitStatus.PENDING_ADMIN_APPROVAL;
    permit.updatedAt = new Date();

    this.logAudit(
      permitId,
      'AI_BEHAVIOR_ANALYSIS',
      'Behavior analysis complete. Auto-forwarding to Admin Approval.',
      'AI_AGENT',
    );

    // Auto-Approve for Demo/MVP Flow
    await this.adminFinalApproval(permitId, 'APPROVE');
  }

  async adminFinalApproval(
    permitId: string,
    adminDecision: 'APPROVE' | 'REJECT',
  ) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');
    if (permit.status !== PermitStatus.PENDING_ADMIN_APPROVAL)
      throw new BadRequestException('Not ready for admin approval');

    permit.adminDecision = adminDecision;
    permit.aiVerificationStages.stage3_adminReview =
      adminDecision === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    if (adminDecision === 'APPROVE') {
      // Differentiate between "Hiring Approval" and "Payment Approval"
      const isWorkSubmission = permit.auditLogs.some(
        (log) => log.action === 'WORK_SUBMITTED',
      );

      if (isWorkSubmission) {
        // This is the Payment Release Step
        this.logAudit(
          permitId,
          'ADMIN_PAYMENT_APPROVAL',
          'Admin approved work completion. Releasing funds.',
          'ADMIN',
        );
        return this.releasePayment(permitId);
      } else {
        // This is the Initial Hiring Step
        permit.status = PermitStatus.ACTIVE;
        this.logAudit(
          permitId,
          'ADMIN_APPROVAL',
          'Permit Activated. Work Authorized.',
          'ADMIN',
        );
        this.logger.log(`🎉 Work Permit ${permitId} ACTIVATED.`);
      }
    } else {
      permit.status = PermitStatus.REJECTED;
      this.logAudit(permitId, 'ADMIN_REJECTION', 'Permit Rejected.', 'ADMIN');
    }

    permit.updatedAt = new Date();
    return permit;
  }

  // Rule 7: Dispute & Permit Freeze
  async raiseDispute(permitId: string, reason: string, actorId: string) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');

    // Automatically Freeze
    const previousStatus = permit.status;
    permit.status = PermitStatus.DISPUTED;
    permit.disputeReason = reason;

    // Mock AI Summary
    permit.aiDisputeSummary = `AI Analysis of Dispute: Discrepancy detected in deliverables vs requirements. Actor ${actorId} raised valid concern.`;

    this.logAudit(
      permitId,
      'DISPUTE_RAISED',
      `Dispute raised by ${actorId}: ${reason}. Status changed from ${previousStatus} to DISPUTED.`,
      actorId,
    );
    this.logger.warn(`⚠️ Dispute raised for Permit ${permitId}`);

    return permit;
  }

  async resolveDispute(
    permitId: string,
    resolution: 'RELEASE_TO_WORKER' | 'REFUND_BUYER' | 'SPLIT',
    splitWorkerAmount?: number,
  ) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');
    if (permit.status !== PermitStatus.DISPUTED)
      throw new BadRequestException('Permit is not disputed');

    // Admin Decision is Irreversible
    this.logAudit(
      permitId,
      'DISPUTE_RESOLUTION',
      `Admin resolved via ${resolution}`,
      'ADMIN',
    );

    if (resolution === 'RELEASE_TO_WORKER') {
      return this.releasePayment(permitId);
    } else if (resolution === 'REFUND_BUYER') {
      // Unlock all funds back to buyer (Refund)
      // Note: Does commission get refunded? Rule 3 says "Buyer cancellation/rejection... Does NOT refund admin or platform charges"
      // But if it's a dispute where Worker did nothing, maybe full refund?
      // Let's assume Rule 3 applies strictly: Commission/Fees are NON-REFUNDABLE.
      // So we only refund the WorkerAmount portion to the Buyer.
      // The Admin/Platform fees are kept by platform.

      await this.paymentService.unlockFunds(
        permit.buyerId,
        permit.workerAmount,
        permit.currency,
        `Refund_Permit_${permitId}`,
      );
      permit.status = PermitStatus.CANCELLED;
      this.logAudit(
        permitId,
        'REFUND_PROCESSED',
        `Refunded ${permit.workerAmount} to Buyer. Fees retained.`,
        'SYSTEM',
      );
    } else if (resolution === 'SPLIT' && splitWorkerAmount !== undefined) {
      // Custom split logic would go here
      // ...
    }

    return permit;
  }

  async submitWork(permitId: string, proof: string, workerId: string) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');
    if (permit.workerId !== workerId)
      throw new BadRequestException('Not authorized');
    if (permit.status !== PermitStatus.ACTIVE)
      throw new BadRequestException(
        'Work is not currently authorized or already submitted',
      );

    permit.status = PermitStatus.PENDING_AI_CHECK;
    permit.aiNotes = 'Pending AI Analysis of submitted proof...';

    // Log Audit
    this.logAudit(
      permitId,
      'WORK_SUBMITTED',
      `Worker submitted proof: ${proof}`,
      workerId,
    );
    this.logger.log(`📤 Work Submitted for Permit ${permitId}`);

    // Trigger AI Check
    this.runAIPreCheck(permitId);

    return permit;
  }

  // Rule 6: Automatic Payment Distribution
  async releasePayment(permitId: string) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');
    // Allow release from ACTIVE (if Admin forces it) or DISPUTED (if resolved) or PENDING_ADMIN_APPROVAL (Standard Flow)
    if (
      permit.status !== PermitStatus.PENDING_ADMIN_APPROVAL &&
      permit.status !== PermitStatus.ACTIVE && // Fallback
      permit.status !== PermitStatus.DISPUTED
    ) {
      throw new BadRequestException(
        `Cannot release payment from status ${permit.status}`,
      );
    }

    try {
      const distResult = await this.paymentService.distributeEscrow(
        permit.jobId,
        permit.totalAmount,
        permit.currency,
        permit.workerId,
      );

      // Save financial split to permit for records
      permit.adminCommission = distResult.distribution.adminCommission;
      permit.platformFee = distResult.distribution.platformFee;

      permit.status = PermitStatus.COMPLETED;
      this.logAudit(
        permitId,
        'PAYMENT_RELEASED',
        `Escrow Distributed: Worker(${distResult.distribution.workerNet}), Admin(${distResult.distribution.adminCommission})`,
        'SYSTEM',
      );

      this.logger.log(`💰 Payment Distributed for Permit ${permitId}`);
      return permit;
    } catch (e) {
      this.logger.error(`Failed to distribute escrow: ${e.message}`);
      throw new BadRequestException(
        `Payment Distribution Failed: ${e.message}`,
      );
    }
  }

  getPermitsByUser(userId: string, role: 'BUYER' | 'WORKER') {
    if (role === 'BUYER') {
      return this.permits.filter((p) => p.buyerId === userId);
    } else {
      return this.permits.filter((p) => p.workerId === userId);
    }
  }

  getAllPermits() {
    return this.permits;
  }

  getPermitById(id: string) {
    return this.permits.find((p) => p.id === id);
  }

  updatePermitDetails(
    permitId: string,
    updates: { title?: string; description?: string },
    userId: string,
  ) {
    const permit = this.permits.find((p) => p.id === permitId);
    if (!permit) throw new NotFoundException('Permit not found');

    // Only Buyer can edit (for now), or Admin
    if (permit.buyerId !== userId && userId !== 'ADMIN') {
      throw new BadRequestException('Not authorized to edit this permit');
    }

    // Allow edits only if NOT Active/Completed/Disputed (unless Admin potentially, but keeping safe)
    if (
      [
        PermitStatus.ACTIVE,
        PermitStatus.COMPLETED,
        PermitStatus.DISPUTED,
      ].includes(permit.status)
    ) {
      throw new BadRequestException('Cannot edit permit in current status.');
    }

    if (updates.title) permit.title = updates.title;
    if (updates.description) permit.description = updates.description;

    permit.updatedAt = new Date();
    this.logAudit(
      permitId,
      'PERMIT_UPDATE',
      `Updated details: ${JSON.stringify(updates)}`,
      userId,
    );

    return permit;
  }
}
