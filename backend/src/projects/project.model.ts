export class Milestone {
  constructor(
    public id: string,
    public description: string,
    public amount: number,
    public status:
      | 'pending'
      | 'submitted'
      | 'approved'
      | 'paid'
      | 'pending_release' = 'pending',
  ) {}
}

export class Project {
  constructor(
    public id: string,
    public name: string,
    public value: number, // Total Job Value
    public status: 'pending' | 'completed' | 'paid' | 'disputed',
    public workerId?: string, // Linked Worker
    public investorId?: string, // If funded by investor
    public investorDividend?: number, // Pre-defined profit
    public description?: string, // Pitch Deck Description
    public fundingGoal?: number, // Target Amount to Raise
    public raisedAmount?: number, // Amount Raised so far
    public milestones: Milestone[] = [], // New: Milestones
    public applicants: string[] = [], // List of Worker IDs who applied
    public details?: any, // Rich job details (skills, location, etc.)
  ) {}
}
