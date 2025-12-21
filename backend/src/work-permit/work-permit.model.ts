export enum PermitStatus {
  PENDING_PAYMENT_LOCK = 'PENDING_PAYMENT_LOCK',
  PENDING_AI_CHECK = 'PENDING_AI_CHECK',
  PENDING_BUYER_REVIEW = 'PENDING_BUYER_REVIEW',
  PENDING_ADMIN_APPROVAL = 'PENDING_ADMIN_APPROVAL',
  ACTIVE = 'ACTIVE', // Approved, work/payment authorized
  DISPUTED = 'DISPUTED', // Rule 7: Freeze
  COMPLETED = 'COMPLETED', // Rule 6: Paid out
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED', // e.g. if funds fail
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  actor: string; // 'SYSTEM' | 'ADMIN' | userId
}

export enum JobType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DAILY_LABOR = 'DAILY_LABOR',
  FREELANCE = 'FREELANCE',
  ENTERPRISE = 'ENTERPRISE',
  GOVERNMENT = 'GOVERNMENT',
  EMERGENCY = 'EMERGENCY',
  FUTURE = 'FUTURE',
  AI_MODEL_TRAINING = 'AI_MODEL_TRAINING',
}

export class WorkPermit {
  id: string;
  jobId: string; // Reference to the potential job
  jobType: JobType;
  workerId: string;
  buyerId: string;

  // Details - Editable
  title?: string;
  description?: string;

  // Financials
  currency: string;
  totalAmount: number;
  workerAmount: number;
  adminCommission: number; // Non-refundable
  platformFee: number; // Non-refundable

  status: PermitStatus;
  escrowLocked: boolean;
  escrowTransactionId?: string;

  // AI Verification
  aiRiskScore: number; // 0-100
  aiNotes: string;
  aiVerificationStages: {
    stage1_preCheck: 'PENDING' | 'PASS' | 'FAIL';
    stage2_behavior: 'PENDING' | 'NORMAL' | 'SUSPICIOUS';
    stage3_adminReview: 'PENDING' | 'APPROVED' | 'REJECTED';
  };

  // Buyer Review
  buyerDecision?: 'APPROVE' | 'REJECT';
  buyerDecisionTime?: Date;

  // Admin Review
  adminDecision?: 'APPROVE' | 'REJECT';

  // Dispute
  disputeReason?: string;
  aiDisputeSummary?: string;

  // Compliance
  auditLogs: AuditLog[];

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<WorkPermit>) {
    Object.assign(this, partial);
    if (!this.auditLogs) this.auditLogs = [];
  }
}
