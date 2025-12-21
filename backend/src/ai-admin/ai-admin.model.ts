export class AiAnalysisResult {
  constructor(
    public entityId: string,
    public riskScore: number, // 0-100
    public riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    public confidenceScore: number, // 0-100
    public suggestedAction: string,
    public reasoning: string[],
    public timestamp: Date,
  ) {}
}

export class DisputeAnalysis {
  constructor(
    public disputeId: string,
    public summary: string,
    public fraudProbability: number,
    public suggestedVerdict:
      | 'REFUND_BUYER'
      | 'RELEASE_TO_WORKER'
      | 'SPLIT_FUNDS',
    public relevantPolicies: string[],
  ) {}
}
