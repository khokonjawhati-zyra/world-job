export class TaxReport {
  constructor(
    public entityId: string, // Worker or Employer ID
    public role: 'worker' | 'employer',
    public year: number,
    public totalEarnings: number = 0, // For Workers
    public totalSpending: number = 0, // For Employers
    public taxWithheld: number = 0, // Optional placeholder
    public generatedAt: Date = new Date(),
  ) {}
}
