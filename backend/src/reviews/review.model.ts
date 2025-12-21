export class Review {
  constructor(
    public id: string,
    public projectId: string,
    public reviewerId: string,
    public targetId: string, // User being reviewed
    public rating: number, // 1-5
    public comment: string,
    public createdAt: Date,
  ) {}
}
