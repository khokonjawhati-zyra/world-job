export class InvestmentProposal {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public workerId: string,
    public budget: number,
    public roi: number, // Return on Investment percentage
    public pitchDeckUrl: string,
    public riskScore: number, // AI-generated risk assessment (0-100)
    public status: 'PENDING' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED',
    public milestones: Array<{
      id: string;
      title: string;
      amount: number;
      status: 'LOCKED' | 'RELEASED';
    }>,
    public ndaSigned: boolean,
    public kycVerified: boolean,
    public raisedAmount: number,
    public investors: Array<{
      id: string;
      amount: number;
      liabilityWaived: boolean;
      ndaSigned: boolean;
    }>,
    public createdAt: Date,
    public executiveSummary: string = '',
    public fundAllocation: string = '', // JSON string or detailed budget breakdown description
    public projectedRoiTimeline: string = '',
    public investorProfitSharePercentage: number = 0,
    public mediaUrls: string[] = [],
    public liabilityDisclaimerAttached: boolean = true, // Auto-attached
    public customCommissionRate?: number, // Optional override
  ) {}
}

export class InvestmentSettings {
  constructor(
    public globalCommissionRate: number = 10, // Default 10%
  ) {}
}
