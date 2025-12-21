export class DigitalIdentity {
  constructor(
    public workerId: string,
    public globalId: string, // Unique Global Worker ID (e.g., GW-2025-8392)
    public fullName: string,
    public trustScore: number, // 0-100
    public riskScore: number, // 0-100 (Lower is better)
    public status: 'verified' | 'pending' | 'flagged' | 'suspended',
    public joinedDate: Date,
    public immutableHash: string, // Simulates blockchain/immutable record hash
    public verificationBadges: string[], // e.g., ['identity', 'skills', 'biometric']
    public metadata: {
      totalJobs: number;
      disputes: number;
      avgRating: number;
    },
  ) {}
}
