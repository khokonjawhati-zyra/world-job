import { Injectable, Logger } from '@nestjs/common';
import { AiAnalysisResult, DisputeAnalysis } from './ai-admin.model';

@Injectable()
export class AiAdminService {
  private readonly logger = new Logger(AiAdminService.name);

  // Mock analyzing payment release
  analyzePaymentRelease(transactionId: string): AiAnalysisResult {
    // Logic: Simulate checks on GPS, Contract, Proof
    // Random mock outcome
    const risk = Math.floor(Math.random() * 100);
    const level =
      risk > 80
        ? 'CRITICAL'
        : risk > 50
          ? 'HIGH'
          : risk > 20
            ? 'MEDIUM'
            : 'LOW';

    return new AiAnalysisResult(
      transactionId,
      risk,
      level,
      85 + Math.floor(Math.random() * 15),
      level === 'LOW' ? 'APPROVE_RELEASE' : 'FREEZE_AND_INVESTIGATE',
      [
        'GPS location matches job site (verified)',
        'Work duration consistent with logs',
        level === 'CRITICAL'
          ? 'Anomaly detected in proof photo metadata'
          : 'Proof of work verified',
      ],
      new Date(),
    );
  }

  // Mock analyzing dispute
  analyzeDispute(disputeId: string): DisputeAnalysis {
    return new DisputeAnalysis(
      disputeId,
      'Worker claims job done, Buyer claims incomplete. AI detects pattern of similar claims from Buyer.',
      65,
      'RELEASE_TO_WORKER',
      ['Section 4.2: Unjustified Rejection', 'Fraud Pattern B-29'],
    );
  }

  // Get prioritized admin workload
  getWorkloadPriority() {
    return [
      {
        id: 't_1',
        type: 'PAYMENT_RELEASE',
        severity: 'HIGH',
        timePending: '2h',
        aiSuggestion: 'Investigate',
      },
      {
        id: 't_2',
        type: 'DISPUTE_RESOLUTION',
        severity: 'CRITICAL',
        timePending: '4h',
        aiSuggestion: 'Refund Buyer',
      },
      {
        id: 't_3',
        type: 'VERIFICATION',
        severity: 'LOW',
        timePending: '10m',
        aiSuggestion: 'Auto-Approve',
      },
    ];
  }
}
