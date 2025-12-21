import { Injectable } from '@nestjs/common';
import { Invoice, Payout, FinancialReport } from './financial.model';

@Injectable()
export class FinancialService {
  private invoices: Invoice[] = [];
  private payouts: Payout[] = [];

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    // Seed some past invoices
    this.invoices.push({
      id: 'INV-1001',
      userId: '201',
      userType: 'EMPLOYER',
      transactionId: 'TRX-9981',
      amount: 1200,
      currency: 'USD',
      date: new Date('2025-12-01'),
      status: 'PAID',
      items: ['React App Development - Milestone 1'],
    });
    this.invoices.push({
      id: 'INV-1002',
      userId: '202',
      userType: 'EMPLOYER',
      transactionId: 'TRX-9985',
      amount: 500,
      currency: 'USD',
      date: new Date('2025-12-05'),
      status: 'PAID',
      items: ['Logo Design'],
    });

    // Seed some payouts
    this.payouts.push({
      id: 'PO-5001',
      workerId: '101',
      amount: 1080, // 1200 - 10%
      currency: 'USD',
      method: 'STRIPE',
      status: 'COMPLETED',
      date: new Date('2025-12-03'),
    });
  }

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  getPayouts(): Payout[] {
    return this.payouts;
  }

  createInvoice(invoice: Partial<Invoice>): Invoice {
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      userId: invoice.userId || 'unknown',
      userType: invoice.userType || 'EMPLOYER',
      transactionId: invoice.transactionId || 'TRX-0000',
      amount: invoice.amount || 0,
      currency: 'USD',
      date: new Date(),
      status: 'PENDING',
      items: invoice.items || ['Service Charge'],
      ...invoice,
    } as Invoice;
    this.invoices.unshift(newInvoice);
    console.log('🧾 Generated Invoice:', newInvoice);
    return newInvoice;
  }

  processPayout(
    workerId: string,
    amount: number,
    method: 'STRIPE' | 'BKASH',
  ): Payout {
    const payout: Payout = {
      id: `PO-${Math.floor(Math.random() * 10000)}`,
      workerId,
      amount,
      currency: 'USD',
      method,
      status: 'PROCESSING', // Simulation of async process
      date: new Date(),
    };
    this.payouts.unshift(payout);
    return payout;
  }

  getFinancialReport(period: string): FinancialReport {
    // Mock calculation logic based on seed data
    const revenue = 120000;
    const totalPayouts = 85000;
    const expenses = 15000;
    const platformFees = revenue * 0.1; // 10% fee

    return {
      period,
      revenue,
      expenses,
      netProfit: revenue - totalPayouts - expenses, // Simplified P&L
      totalPayouts,
      platformFees,
    };
  }
}
