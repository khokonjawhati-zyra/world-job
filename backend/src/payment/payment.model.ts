export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'stripe' | 'bkash';
  details: {
    last4?: string; // For Stripe
    brand?: string; // For Stripe
    phoneNumber?: string; // For bKash
  };
  isPrimary: boolean;
  status: 'active' | 'suspended';
  currency: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}
