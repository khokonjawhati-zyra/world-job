export class Dispute {
  constructor(
    public id: string,
    public projectId: string,
    public initiatorId: string,
    public reason: string,
    public status: 'open' | 'resolved' | 'closed',
    public createdAt: Date,
  ) {}
}
