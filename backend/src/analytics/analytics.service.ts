import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  // Mock Data for Demand Heatmap
  private demandData = [
    {
      location: 'New York, US',
      demandScore: 95,
      activeJobs: 150,
      workerSupply: 'Low',
    },
    {
      location: 'London, UK',
      demandScore: 88,
      activeJobs: 120,
      workerSupply: 'Medium',
    },
    {
      location: 'Berlin, DE',
      demandScore: 72,
      activeJobs: 85,
      workerSupply: 'High',
    },
    {
      location: 'Bangalore, IN',
      demandScore: 60,
      activeJobs: 200,
      workerSupply: 'Very High',
    },
    {
      location: 'San Francisco, US',
      demandScore: 98,
      activeJobs: 90,
      workerSupply: 'Low',
    },
    {
      location: 'Remote',
      demandScore: 100,
      activeJobs: 500,
      workerSupply: 'High',
    },
  ];

  // Mock Data for Fraud Alerts
  private fraudAlerts = [
    {
      id: 'F001',
      user: 'User_992',
      type: 'Payment',
      riskScore: 92,
      reason: 'Multiple high-value cards declined',
      status: 'Active',
    },
    {
      id: 'F002',
      user: 'Job_Req_22',
      type: 'Job Post',
      riskScore: 85,
      reason: 'Keyword match: "Easy money"',
      status: 'Investigating',
    },
    {
      id: 'F003',
      user: 'Worker_55',
      type: 'Identity',
      riskScore: 45,
      reason: 'IP Mismatch during login',
      status: 'Resolved',
    },
  ];

  getDemandHeatmap() {
    return this.demandData;
  }

  getFraudAlerts() {
    return this.fraudAlerts;
  }

  // Simulate AI analysis
  analyzeRisk(data: any) {
    // Simple mock logic: length of description inversely proportional to risk?
    // Just returning random for demo purposes if not specific.
    return {
      riskScore: Math.floor(Math.random() * 100),
      flagged: Math.random() > 0.8,
      analysis: 'AI Analysis complete. Pattern matches standard deviation.',
    };
  }
}
