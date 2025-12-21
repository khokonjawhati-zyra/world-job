export class Investor {
  constructor(
    public id: string,
    public name: string,
    public shares: number,
    public balance: number,
    public totalDividends: number,
  ) {}
}
