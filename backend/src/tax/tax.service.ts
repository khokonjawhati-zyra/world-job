import { Injectable } from '@nestjs/common';
import { FinancialService } from '../financial/financial.service';
import { TaxReport } from './tax.model';

@Injectable()
export class TaxService {
  constructor(private financialService: FinancialService) {}

  generateWorkerReport(workerId: string, year: number) {
    const payouts = this.financialService.getPayouts();

    let totalEarnings = 0;
    let totalWithheld = 0;

    // Filter payouts for this worker and year
    payouts.forEach((p) => {
      const payoutYear = new Date(p.date).getFullYear();
      if (
        p.workerId === workerId &&
        payoutYear === year &&
        p.status === 'COMPLETED'
      ) {
        totalEarnings += p.amount;
        // In our model, amount is net. Gross would be amount / 0.9.
        // Withheld = Gross - Net.
        // Let's assume we want to report Gross Earnings.
        const gross = p.amount / 0.9;
        totalWithheld += gross - p.amount;
      }
    });

    // For simplicity in this demo, we report the Payout Amount as "Taxable Income"
    // In reality, 1099 would report Gross.
    // Let's calculate Gross for the report to be "Compliance Ready"
    const grossEarnings = totalEarnings / 0.9;

    return new TaxReport(workerId, 'worker', year, grossEarnings, 0); // Using Gross for consistency
  }

  generateEmployerReport(employerId: string, year: number) {
    const invoices = this.financialService.getInvoices();
    let totalSpending = 0;

    invoices.forEach((inv) => {
      const invYear = new Date(inv.date).getFullYear();
      if (
        inv.userId === employerId &&
        invYear === year &&
        inv.status === 'PAID'
      ) {
        totalSpending += inv.amount;
      }
    });

    return new TaxReport(employerId, 'employer', year, 0, totalSpending);
  }

  generateAdminReport(year: number) {
    const invoices = this.financialService.getInvoices();
    const payouts = this.financialService.getPayouts();

    let totalRevenue = 0; // Invoices
    let totalPayouts = 0; // Payouts

    invoices.forEach((inv) => {
      if (new Date(inv.date).getFullYear() === year && inv.status === 'PAID') {
        totalRevenue += inv.amount;
      }
    });

    payouts.forEach((p) => {
      if (new Date(p.date).getFullYear() === year && p.status === 'COMPLETED') {
        totalPayouts += p.amount;
      }
    });

    const platformFees = totalRevenue - totalPayouts; // Rough approximation of Net Revenue

    return {
      year,
      totalSystemVolume: totalRevenue,
      totalPayoutsProcessed: totalPayouts,
      grossPlatformRevenue: platformFees,
      generatedAt: new Date(),
      formType: '1099-K Aggregate',
    };
  }
}
