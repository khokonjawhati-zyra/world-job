export class CommunityGroup {
  constructor(
    public id: string,
    public name: string,
    public location: string, // e.g., 'New York', 'Remote'
    public description: string,
    public members: string[] = [], // userIds
    public updates: { date: string; content: string; author: string }[] = [],
  ) {}
}

export class MentorshipRequest {
  constructor(
    public id: string,
    public mentorId: string,
    public menteeId: string,
    public status: 'pending' | 'accepted' | 'rejected' | 'completed',
    public goal: string,
    public duration: string, // e.g. '3 months'
  ) {}
}
