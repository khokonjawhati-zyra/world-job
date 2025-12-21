import { Injectable } from '@nestjs/common';
import { Investor } from './investor.model';

@Injectable()
export class InvestorsService {
  private investors: Investor[] = [
    new Investor('1', 'Main Investor', 500, 5000, 345.5),
    new Investor('2', 'Angel Investor', 2000, 15000, 1200.0),
  ];
  private totalShares = 10000;

  findAll(): Investor[] {
    return this.investors;
  }

  findOne(id: string): Investor | undefined {
    return this.investors.find((i) => i.id === id);
  }

  // Distribute Platform Pool (30% of fees) to all shareholders
  distributePool(amount: number) {
    this.investors.forEach((investor) => {
      const share = (investor.shares / this.totalShares) * amount;
      investor.balance += share;
      investor.totalDividends += share;
    });
  }

  // Pay specific project dividend to a funded investor
  payDividend(id: string, amount: number) {
    const investor = this.findOne(id);
    if (investor) {
      investor.balance += amount;
      investor.totalDividends += amount;
    }
  }

  getStats() {
    return {
      totalShares: this.totalShares,
      totalInvestors: this.investors.length,
    };
  }
  // Deduct funds for investment
  investFunds(id: string, amount: number): boolean {
    const investor = this.findOne(id);
    if (investor && investor.balance >= amount) {
      investor.balance -= amount;
      // In a real app, you might track this as "invested_capital" increment
      // investor.invested_capital += amount;
      return true;
    }
    return false;
  }
}
