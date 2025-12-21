import { Injectable, Logger } from '@nestjs/common';
import { DigitalIdentity } from './identity.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);
  private identities: Map<string, DigitalIdentity> = new Map();

  constructor() {
    // Seed a mock identity for worker 101
    this.createIdentity('101', 'John Doe');
  }

  createIdentity(workerId: string, fullName: string): DigitalIdentity {
    const existing = this.identities.get(workerId);
    if (existing) {
      return existing;
    }

    const globalId = `GW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIdentity = new DigitalIdentity(
      workerId,
      globalId,
      fullName,
      85, // Initial Trust Score
      5, // Initial Risk Score (Low)
      'verified',
      new Date(),
      uuidv4(), // Mock immutable hash
      ['identity', 'biometric'],
      { totalJobs: 12, disputes: 0, avgRating: 4.8 },
    );

    this.identities.set(workerId, newIdentity);
    return newIdentity;
  }

  getIdentity(workerId: string): DigitalIdentity {
    let identity = this.identities.get(workerId);
    if (!identity) {
      // Auto-create for demo purposes if not found
      identity = this.createIdentity(workerId, 'Unknown Worker');
    }
    return identity;
  }

  verifyIdentity(workerId: string): any {
    const identity = this.getIdentity(workerId);
    // Simulate AI Verification Logic
    const riskCheck = Math.random() < 0.95 ? 'pass' : 'fail'; // 95% pass rate

    if (riskCheck === 'fail') {
      identity.riskScore += 20;
      identity.status = 'flagged';
    } else {
      identity.riskScore = Math.max(0, identity.riskScore - 5);
      identity.status = 'verified';
    }

    // Recalculate Trust Score based on "AI" analysis of history
    identity.trustScore = Math.min(
      100,
      50 + identity.metadata.totalJobs * 2 - identity.metadata.disputes * 10,
    );

    return {
      success: true,
      riskScore: identity.riskScore,
      trustScore: identity.trustScore,
      status: identity.status,
      checkTimestamp: new Date(),
    };
  }

  // Admin function to override/blacklist
  setRiskStatus(
    workerId: string,
    status: 'verified' | 'suspended',
    riskScore: number,
  ) {
    const identity = this.getIdentity(workerId);
    if (identity) {
      identity.status = status;
      identity.riskScore = riskScore;
      return identity;
    }
    return null;
  }
}
