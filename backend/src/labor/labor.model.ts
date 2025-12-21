export class AttendanceRecord {
  constructor(
    public id: string,
    public jobId: string,
    public workerId: string,
    public status:
      | 'pending'
      | 'checked-in'
      | 'checked-out'
      | 'approved'
      | 'paid'
      | 'pending_payment' = 'pending',
    public checkInTime?: Date,
    public checkOutTime?: Date,
    public proofMedia: string[] = [], // URLs to photos/videos
  ) {}
}

export class LaborJob {
  constructor(
    public id: string,
    public employerId: string,
    public title: string,
    public description: string,
    public location: string, // e.g., "New York, NY" or coordinates
    public date: Date,
    public shiftStart: string, // "08:00"
    public shiftEnd: string, // "17:00"
    public vacancies: number, // Total workers needed
    public hiredCount: number = 0,
    public wage: number, // Per day/hour
    public category:
      | 'construction'
      | 'events'
      | 'cleaning'
      | 'factory'
      | 'other',
    public status: 'open' | 'filled' | 'completed' = 'open',
    public applicants: string[] = [], // User IDs
    public hiredWorkers: string[] = [], // User IDs
  ) {}
}
