export class VerificationRequest {
  constructor(
    public id: string,
    public userId: string,
    public userType: 'WORKER' | 'EMPLOYER' | 'INVESTOR',
    public type: 'IDENTITY' | 'PHONE' | 'EMAIL',
    public data: string, // URL for ID, phone number, or email
    public status: 'PENDING' | 'APPROVED' | 'REJECTED',
    public submittedAt: Date,
  ) {}
}
