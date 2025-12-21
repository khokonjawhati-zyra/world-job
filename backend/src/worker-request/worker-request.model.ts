export class WorkerRequest {
  constructor(
    public id: string,
    public workerId: string,
    public title: string, // e.g. "Looking for React Native projects"
    public description: string,
    public preferredRate: number,
    public skills: string[],
    public status: 'OPEN' | 'CLOSED' = 'OPEN',
    public createdAt: Date = new Date(),
  ) {}
}
