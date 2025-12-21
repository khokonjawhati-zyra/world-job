export interface Invoice {
  id: string;
  userId: string;
  userType: 'EMPLOYER' | 'WORKER';
  transactionId: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'PAID' | 'PENDING';
  items: string[];
}

export interface Payout {
  id: string;
  workerId: string;
  amount: number;
  currency: string;
  method: 'STRIPE' | 'BKASH';
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  date: Date;
}

export interface FinancialReport {
  period: string; // e.g., "2025-Q1", "2025-10"
  revenue: number;
  expenses: number;
  netProfit: number;
  totalPayouts: number;
  platformFees: number;
}
