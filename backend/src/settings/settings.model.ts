export class SystemSettings {
  constructor(
    public platformFeePercentage: number = 10, // Default 10%
    public investorDividendPercentage: number = 30, // Default 30% of the platform fee
    public termsAndConditions: string = '<h2>Terms and Conditions</h2><p>Welcome to World Job Market. By using our platform, you agree to the following terms...</p>',
  ) { }
}
