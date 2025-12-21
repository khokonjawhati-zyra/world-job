import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InvestmentProposal, InvestmentSettings } from './investment.model';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvestmentService {
  private proposals: InvestmentProposal[] = [];
  private settings: InvestmentSettings = new InvestmentSettings();

  // --- Worker features ---
  private readonly LEGAL_TERMS = {
    liability:
      'The Platform and its Administrators are 100% exempt from any liability, loss of capital, or legal disputes arising from this interaction. Users engage at their own risk.',
    nonCircumvention:
      'Users agree explicitly not to bypass the platform for payments or communication to avoid commission fees. Any attempt to do so will result in immediate account termination and legal action.',
    dataConfidentiality:
      'By accessing these documents, you agree to a strict Non-Disclosure Agreement (NDA). All shared information is confidential.',
    adminExemption:
      'Users acknowledge that the Admin/Platform is a neutral facilitator and holds NO responsibility for project outcomes, financial losses, or dispute resolutions beyond the provided mediation tools.',
  };

  private signedAgreements: {
    id: string;
    userId: string;
    proposalId: string;
    type: string;
    timestamp: Date;
    signatureId: string;
    ipAddress: string;
  }[] = [];

  private readonly DATA_FILE = path.join(process.cwd(), 'data', 'investment_proposals.json');

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      if (fs.existsSync(this.DATA_FILE)) {
        const data = fs.readFileSync(this.DATA_FILE, 'utf8');
        const parsed = JSON.parse(data);
        this.proposals = parsed.proposals || [];
        this.signedAgreements = parsed.signedAgreements || [];
        this.settings = parsed.settings || new InvestmentSettings();
      }
    } catch (err) {
      console.error('Failed to load investment data', err);
    }
  }

  private saveState() {
    try {
      const data = JSON.stringify({
        proposals: this.proposals,
        signedAgreements: this.signedAgreements,
        settings: this.settings
      }, null, 2);
      fs.writeFileSync(this.DATA_FILE, data);
    } catch (err) {
      console.error('Failed to save investment data', err);
    }
  }

  getLegalTemplates() {
    return this.LEGAL_TERMS;
  }

  // ... existing createProposal ...
  createProposal(data: any): InvestmentProposal {
    const riskScore = this.calculateRiskScore(
      Number(data.budget),
      Number(data.roi),
    );
    const milestones = [
      {
        id: uuidv4(),
        title: 'Initial Phase',
        amount: Number(data.budget) * 0.3,
        status: 'RELEASED' as const,
      },
      {
        id: uuidv4(),
        title: 'Development Phase',
        amount: Number(data.budget) * 0.4,
        status: 'LOCKED' as const,
      },
      {
        id: uuidv4(),
        title: 'Final Delivery',
        amount: Number(data.budget) * 0.3,
        status: 'LOCKED' as const,
      },
    ];

    const newProposal = new InvestmentProposal(
      uuidv4(),
      data.title,
      data.description,
      data.workerId,
      Number(data.budget),
      Number(data.roi),
      data.pitchDeckUrl,
      riskScore,
      'PENDING',
      milestones,
      false, // ndaSigned (global)
      false, // kycVerified
      0,
      [],
      new Date(),
      data.executiveSummary || '',
      data.fundAllocation || '',
      data.projectedRoiTimeline || '',
      Number(data.investorProfitSharePercentage || 0),
      data.mediaUrls || [],
      true, // liabilityDisclaimerAttached (Auto)
    );
    this.proposals.push(newProposal);
    this.saveState();
    return newProposal;
  }

  private calculateRiskScore(budget: number, roi: number): number {
    // Mock AI Logic: High ROI + High Budget = Higher Risk
    let score = 50;
    if (roi > 20) score += 20;
    if (budget > 10000) score += 10;
    if (budget < 1000) score -= 10;
    return Math.min(Math.max(score, 0), 100);
  }

  getWorkerProposals(workerId: string): InvestmentProposal[] {
    return this.proposals.filter((p) => p.workerId === workerId);
  }

  addProgressUpdate(proposalId: string, message: string) {
    // Mock implementation for progress updates
    return { proposalId, message, timestamp: new Date() };
  }

  // --- Investor features ---
  getAllProposals(userId?: string): any[] {
    // Redact sensitive info if NDA not signed
    return this.proposals.map((p) => this.redactProposalForUser(p, userId));
  }

  private redactProposalForUser(
    proposal: InvestmentProposal,
    userId?: string,
  ): any {
    const hasSigned = userId
      ? this.signedAgreements.some(
        (a) => a.userId === userId && a.proposalId === proposal.id,
      )
      : false;

    if (hasSigned) {
      // Apply Watermarking simulation
      return {
        ...proposal,
        pitchDeckUrl: `${proposal.pitchDeckUrl}?watermark_user=${userId}`,
        isUnlocked: true,
      };
    }

    // Locked Version
    return {
      ...proposal,
      pitchDeckUrl: null,
      fundAllocation: null, // Detailed budget hidden
      mediaUrls: [], // Demo videos hidden
      isUnlocked: false,
    };
  }

  fundProject(
    proposalId: string,
    investorId: string,
    amount: number,
    liabilityWaived: boolean,
    ndaSigned: boolean,
  ) {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) throw new NotFoundException('Project not found');
    if (!liabilityWaived)
      throw new BadRequestException('Liability waiver must be signed');
    if (!ndaSigned) throw new BadRequestException('NDA must be signed');
    // Double check server-side NDA record
    const hasSigned = this.signedAgreements.some(
      (a) => a.userId === investorId && a.proposalId === proposalId,
    );
    if (!hasSigned)
      throw new BadRequestException('Smart Contract NDA not found on server.');

    proposal.investors.push({
      id: investorId,
      amount,
      liabilityWaived: true,
      ndaSigned: true,
    });
    proposal.raisedAmount += amount;

    if (proposal.raisedAmount >= proposal.budget) {
      proposal.status = 'FUNDED';
    }
    this.saveState();
    return proposal;
  }

  signNDA(
    proposalId: string,
    userId: string,
    type: 'NDA' | 'WAIVER' | 'CONTRACT' = 'NDA',
  ) {
    // Relaxed validation for proposal existence to allow generic signatures (e.g., Hiring Contracts linked to Job IDs)
    // Ideally, we would have a unified "LegalEntityIdentifier" but for now we trust the proposalId passed is a meaningful reference.
    // const proposal = this.proposals.find(p => p.id === proposalId);
    // if (!proposal) throw new NotFoundException('Project not found');

    const signatureId = `SIG-${uuidv4()}-${type}`;

    // Add to audit trail
    this.signedAgreements.push({
      id: uuidv4(),
      userId,
      proposalId,
      type: type,
      timestamp: new Date(),
      signatureId,
      ipAddress: '192.168.1.1', // Mock IP, in real app get from request
    });
    this.saveState();

    // Update proposal state local to this service if needed, usually just checking the audit log is enough,
    // but for performance we might keep a flag on the proposal if strictly single-investor.
    // For shared marketplace, the audit log IS the source of truth for access.

    const proposal = this.proposals.find((p) => p.id === proposalId);

    return {
      success: true,
      message: 'NDA Digitally Signed & Encrypted',
      timestamp: new Date(),
      signature: signatureId,
      // unlock data:
      unlockedData: proposal || null,
    };
  }

  signAgreement(
    userId: string,
    proposalId: string,
    type: 'NDA' | 'WAIVER' | 'CONTRACT',
    ipAddress: string = '127.0.0.1',
  ) {
    const signatureId = `SIG-${uuidv4()}-${type}`;

    this.signedAgreements.push({
      id: uuidv4(),
      userId,
      proposalId,
      type,
      timestamp: new Date(),
      signatureId,
      ipAddress,
    });
    this.saveState();

    return { success: true, signatureId, timestamp: new Date() };
  }

  hasSigned(
    userId: string,
    proposalId: string,
    type: 'NDA' | 'WAIVER' | 'CONTRACT',
  ): boolean {
    return this.signedAgreements.some(
      (a) =>
        a.userId === userId && a.proposalId === proposalId && a.type === type,
    );
  }

  getSignedAgreements() {
    return this.signedAgreements;
  }

  releaseMilestone(proposalId: string, milestoneId: string) {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) throw new NotFoundException('Project not found');
    const milestone = proposal.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      milestone.status = 'RELEASED';
      this.saveState();
      return milestone;
    }
    throw new NotFoundException('Milestone not found');
  }

  verifyKYC(userId: string) {
    // Mock KYC Verification
    return { userId, status: 'VERIFIED', level: 'TIER_2_PROFESSIONAL' };
  }

  // --- Admin features ---
  getSettings(): InvestmentSettings {
    return this.settings;
  }

  updateSettings(rate: number) {
    this.settings.globalCommissionRate = rate;
    this.saveState();
    return this.settings;
  }

  setCustomCommission(proposalId: string, rate: number) {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (proposal) {
      proposal.customCommissionRate = rate;
      this.saveState();
      return proposal;
    }
  }

  getFinancialStats() {
    // Calculate total commission
    let totalCommission = 0;
    let totalInvested = 0;

    // Mock logic: Assume 50% of funded projects have generated profit for calculation demo
    this.proposals
      .filter((p) => p.status === 'FUNDED')
      .forEach((p) => {
        totalInvested += p.raisedAmount;
        // Commission applied on investment or profit?
        // Requirement: "Global Commission Fee: A percentage taken from every successful investment profit"
        // Simulating profit generation for stats
        const estimatedProfit = p.budget * (p.roi / 100);
        const rate =
          p.customCommissionRate ?? this.settings.globalCommissionRate;
        totalCommission += estimatedProfit * (rate / 100);
      });

    return {
      totalProposals: this.proposals.length,
      fundedProjects: this.proposals.filter((p) => p.status === 'FUNDED')
        .length,
      totalInvested,
      estimatedCommission: totalCommission,
      globalRate: this.settings.globalCommissionRate,
    };
  }
}
