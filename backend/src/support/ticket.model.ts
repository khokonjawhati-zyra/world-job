export class Ticket {
  constructor(
    public id: string,
    public userId: string,
    public userType: 'worker' | 'employer' | 'investor',
    public subject: string,
    public description: string,
    public priority: 'low' | 'medium' | 'high',
    public status: 'open' | 'in_progress' | 'resolved',
    public createdAt: Date,
    public disputeId?: string, // Optional link to a dispute
  ) {}
}
