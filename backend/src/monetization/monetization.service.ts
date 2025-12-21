import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionPlan, AdCampaign } from './monetization.model';
import { PaymentService } from '../payment/payment.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MonetizationService {
  private readonly logger = new Logger(MonetizationService.name);
  private readonly SUBSCRIPTION_FILE = path.join(
    process.cwd(),
    'data',
    'subscriptions.json',
  );

  private plans: SubscriptionPlan[] = [
    new SubscriptionPlan(
      'p_worker_basic',
      'Basic',
      'worker',
      0,
      'Standard Access',
      ['Apply to 10 jobs/day', 'Basic Support'],
    ),
    new SubscriptionPlan(
      'p_worker_pro',
      'Pro Worker',
      'worker',
      9.99,
      'Enhanced Visibility',
      [
        'Apply to Unlimited jobs',
        'Featured Profile Badge',
        'Priority Support',
        'Access to Premium Jobs',
      ],
    ),
    new SubscriptionPlan(
      'p_employer_basic',
      'Starter',
      'employer',
      0,
      'Basic Hiring',
      ['Post 3 jobs/month', 'Standard Support'],
    ),
    new SubscriptionPlan(
      'p_employer_biz',
      'Business',
      'employer',
      49.99,
      'Scale Your Hiring',
      [
        'Unlimited Job Posts',
        'Featured Job Listings',
        'Advanced Candidate Analytics',
        'Dedicated Account Manager',
      ],
    ),
  ];

  private ads: AdCampaign[] = [
    new AdCampaign(
      'ad_1',
      'SafetyFirst',
      'High-Vis Gear Sale',
      'https://via.placeholder.com/300x100?text=Safety+Gear',
      'worker',
    ),
    new AdCampaign(
      'ad_2',
      'ToolMaster',
      'Pro Power Tools',
      'https://via.placeholder.com/300x100?text=Power+Tools',
      'worker',
    ),
    new AdCampaign(
      'ad_3',
      'CloudHR',
      'Manage Teams Better',
      'https://via.placeholder.com/300x100?text=HR+Software',
      'employer',
    ),
  ];

  private boostRequests: any[] = [];
  private subscriptions: Map<string, string> = new Map(); // userId -> planId

  constructor(private paymentService: PaymentService) {
    this.loadSubscriptions();
  }

  private loadSubscriptions() {
    try {
      if (fs.existsSync(this.SUBSCRIPTION_FILE)) {
        const data = fs.readFileSync(this.SUBSCRIPTION_FILE, 'utf8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          parsed.forEach(([k, v]) => this.subscriptions.set(k, v));
        }
      }
    } catch (e) {
      this.logger.error('Failed to load subscriptions', e);
    }
  }

  private saveSubscriptions() {
    try {
      const data = JSON.stringify(
        Array.from(this.subscriptions.entries()),
        null,
        2,
      );
      fs.writeFileSync(this.SUBSCRIPTION_FILE, data);
    } catch (e) {
      this.logger.error('Failed to save subscriptions', e);
    }
  }

  getPlans(role: 'worker' | 'employer') {
    return this.plans.filter((p) => p.role === role);
  }

  getAds(role: string) {
    return this.ads.filter(
      (a) => a.targetRole === role || a.targetRole === 'all',
    );
  }

  boostContent(id: string, type: string, amount: number) {
    // Mock payment processing
    const boost = { id, type, amount, date: new Date(), status: 'active' };
    this.boostRequests.push(boost);
    return {
      success: true,
      message: `${type} boosted successfully!`,
      boostData: boost,
    };
  }

  updatePlan(id: string, updates: Partial<SubscriptionPlan>) {
    const planIndex = this.plans.findIndex((p) => p.id === id);
    if (planIndex > -1) {
      this.plans[planIndex] = { ...this.plans[planIndex], ...updates };
      return this.plans[planIndex];
    }
    return null;
  }

  createPlan(plan: SubscriptionPlan) {
    this.plans.push(plan);
    return plan;
  }

  deletePlan(id: string) {
    this.plans = this.plans.filter((p) => p.id !== id);
    return { success: true };
  }

  getAllPlans() {
    return this.plans;
  }

  subscribe(userId: string, planId: string) {
    const plan = this.plans.find((p) => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    // Check if upgrade/paid
    if (plan.price > 0) {
      const currentBalance = this.paymentService.getBalance(userId, 'USD');
      if (currentBalance < plan.price) {
        throw new Error('Insufficient Funds');
      }

      // Deduct Payment
      this.paymentService.adminAdjustBalance(
        userId,
        plan.price,
        'subtract',
        'USD',
        `Subscription Upgrade: ${plan.name}`,
      );
    }

    this.subscriptions.set(userId, planId);
    this.saveSubscriptions();
    return { success: true, message: `Subscribed to ${plan.name}`, plan };
  }

  getSubscription(userId: string) {
    const planId = this.subscriptions.get(userId);
    return planId ? this.plans.find((p) => p.id === planId) : null;
  }
}
