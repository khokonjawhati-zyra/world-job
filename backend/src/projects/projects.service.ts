import { Injectable, OnModuleInit } from '@nestjs/common';
import { Project } from './project.model';
import { InvestorsService } from '../investors/investors.service';

import { PaymentService } from '../payment/payment.service';
import { SettingsService } from '../settings/settings.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectsService implements OnModuleInit {
  private projects: Project[] = [];
  private readonly dataPath = path.join(process.cwd(), 'data', 'projects.json');

  private readonly initialProjects: Project[] = [
    new Project(
      '101',
      'E-commerce App',
      5000,
      'completed',
      '101',
      '101',
      500,
      undefined,
      undefined,
      undefined,
      undefined,
      [],
      [],
    ),
    new Project(
      '102',
      'Logo Design',
      200,
      'completed',
      '101',
      '102',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [],
      [],
    ),
    new Project(
      '103',
      'SEO Audit',
      1000,
      'pending',
      '101',
      '101',
      500,
      undefined,
      undefined,
      undefined,
      [
        {
          id: 'm1',
          description: 'Initial Audit Report',
          amount: 300,
          status: 'pending',
        },
        {
          id: 'm2',
          description: 'Fix Critical Errors',
          amount: 400,
          status: 'pending',
        },
        {
          id: 'm3',
          description: 'Final Report',
          amount: 300,
          status: 'pending',
        },
      ],
      [], // Applicants
    ),
    new Project(
      '104',
      'Smart Contract Audit',
      2500,
      'pending',
      '102',
      '105',
      200,
      undefined,
      undefined,
      undefined,
      undefined,
      [],
      [],
    ),
    new Project(
      '105',
      'AI Trading Bot',
      10000,
      'pending',
      '101',
      '101',
      undefined,
      'An AI agent that trades crypto.',
      5000,
      1000,
      [],
      [], // Applicants
    ),
    new Project(
      '106',
      'VR Metaverse Game',
      50000,
      'pending',
      '102',
      '102',
      undefined,
      'Next-gen VR experience on Web3.',
      20000,
      5000,
      [], // Milestones
      [], // Applicants
    ),
  ];

  constructor(
    private investorsService: InvestorsService,
    private paymentService: PaymentService,
    private settingsService: SettingsService,
  ) { }

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const fileData = fs.readFileSync(this.dataPath, 'utf-8');
        this.projects = JSON.parse(fileData);

        // Data Migration / Fix for nested details (legacy data issue)
        let dataChanged = false;
        this.projects.forEach(p => {
          if (p.details && p.details.details) {
            console.log(`[ProjectsService] Fixing nested details for project ${p.id}`);
            p.details = { ...p.details, ...p.details.details };
            delete p.details.details;
            dataChanged = true;
          }
        });

        if (dataChanged) {
          this.saveData();
          console.log('[ProjectsService] Data migration applied and saved.');
        }

        console.log(`[ProjectsService] Loaded ${this.projects.length} projects from storage.`);
      } else {
        console.log('[ProjectsService] Storage not found. Seeding initial data...');
        this.projects = [...this.initialProjects];
        this.saveData();
      }
    } catch (error) {
      console.error('[ProjectsService] Failed to load data:', error);
      this.projects = [...this.initialProjects]; // Fallback
    }
  }

  private saveData() {
    try {
      const dir = path.dirname(this.dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dataPath, JSON.stringify(this.projects, null, 2));
    } catch (error) {
      console.error('[ProjectsService] Failed to save data:', error);
    }
  }

  create(data: any) {
    const id = (this.projects.length + 100).toString() + '-' + Date.now();
    // Map frontend form data to Project model
    // data contains: jobTitle, jobCategory, salaryMin, salaryMax, etc.
    // Fixed: Properly unwrap details. If 'details' property exists in data, use it. Otherwise use data itself.
    const details = data.details || data;

    const newProject = new Project(
      id,
      data.jobTitle || 'Untitled Job',
      Number(data.salaryMax) || 0, // Use max salary as value for now
      'pending',
      undefined, // No worker yet
      data.employerId, // Assuming passed
      undefined,
      data.description,
      undefined,
      undefined,
      [],
      [], // Applicants
      details, // Store cleaned details
    );
    this.projects.unshift(newProject);
    this.saveData();
    return newProject;
  }

  update(id: string, data: any) {
    const project = this.findOne(id);
    if (!project) throw new Error('Project not found');

    // Update basic fields
    if (data.jobTitle) project.name = data.jobTitle;
    if (data.salaryMax) project.value = Number(data.salaryMax);
    if (data.description) project.description = data.description;

    // Update details
    // If Incoming data has a 'details' wrapper (like from EmployerDashboard), use it.
    const incomingDetails = data.details || data;

    // Merge with existing details
    project.details = { ...project.details, ...incomingDetails };

    this.saveData();
    return project;
  }

  apply(projectId: string, workerId: string) {
    const project = this.findOne(projectId);
    if (!project) throw new Error('Project not found');

    if (!project.applicants) project.applicants = [];
    if (!project.applicants.includes(workerId)) {
      project.applicants.push(workerId);
      this.saveData();
    }
    return project;
  }

  addMilestone(projectId: string, description: string, amount: number) {
    const project = this.findOne(projectId);
    if (!project) throw new Error('Project not found');

    // Validation: Milestones sum shouldn't exceed remaining project value (omitted for demo simplicity)

    project.milestones.push({
      id: Date.now().toString(),
      description,
      amount,
      status: 'pending',
    });
    this.saveData();
    return project;
  }

  submitMilestone(projectId: string, milestoneId: string) {
    const project = this.findOne(projectId);
    if (!project) throw new Error('Project not found');

    const milestoneIndex = project.milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    if (milestoneIndex === -1) throw new Error('Milestone not found');

    // Enforce Sequential Submission
    for (let i = 0; i < milestoneIndex; i++) {
      if (project.milestones[i].status !== 'paid') {
        throw new Error(
          'Previous milestones must be completed and paid first.',
        );
      }
    }

    const milestone = project.milestones[milestoneIndex];
    milestone.status = 'submitted';
    this.saveData();
    return project;
  }

  // 1. Employer Approves -> Sets to Pending Release (Waiting for Admin)
  async approveMilestone(projectId: string, milestoneId: string) {
    const project = this.findOne(projectId);
    if (!project) throw new Error('Project not found');

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');
    if (milestone.status !== 'submitted')
      throw new Error('Milestone must be submitted first');

    milestone.status = 'pending_release';
    this.saveData();
    return {
      message: 'Milestone approved. Waiting for Admin release.',
      milestone,
    };
  }

  // 2. Admin Releases -> Triggers Pay & Commission
  async adminReleaseMilestone(projectId: string, milestoneId: string) {
    const project = this.findOne(projectId);
    if (!project) throw new Error('Project not found');

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');
    if (milestone.status !== 'pending_release')
      throw new Error('Milestone is not pending release');

    // Trigger Partial Payment Logic
    milestone.status = 'paid';

    const feeRate = this.settingsService.getPlatformFeeRate();
    const dividendRate = this.settingsService.getInvestorDividendRate();

    const platformFee = milestone.amount * feeRate;
    const investorPool = platformFee * dividendRate;
    const netWorkerPay = milestone.amount * (1 - feeRate);

    // 1. Distribute to Global Pool (Partial)
    this.investorsService.distributePool(investorPool);

    // 2. Release Escrow Funds to Worker (Integrated)
    if (project.workerId) {
      await this.paymentService.releaseEscrow(
        project.id,
        project.workerId,
        netWorkerPay,
      );
    } else {
      console.warn(
        `[Warning] Project ${projectId} has no worker assigned. Funds not released.`,
      );
    }

    console.log(
      `[Escrow] Released $${netWorkerPay} to Worker for milestone ${milestone.description}`,
    );

    // Check if all milestones are paid to complete project?
    const allPaid = project.milestones.every((m) => m.status === 'paid');
    if (allPaid && project.milestones.length > 0) {
      project.status = 'completed';
    }

    this.saveData();

    return {
      milestone,
      payouts: {
        platformFee,
        investorPool,
        netWorkerPay,
      },
    };
  }

  // Helper for Admin Panel
  getPendingReleases() {
    const pending: any[] = [];
    this.projects.forEach((p) => {
      p.milestones.forEach((m) => {
        if (m.status === 'pending_release') {
          pending.push({
            projectId: p.id,
            projectName: p.name,
            milestoneId: m.id,
            description: m.description,
            amount: m.amount,
            workerId: p.workerId,
          });
        }
      });
    });
    return pending;
  }

  findAll() {
    return this.projects;
  }

  findOne(id: string) {
    return this.projects.find((p) => p.id === id);
  }

  flagDispute(id: string) {
    const project = this.findOne(id);
    if (project) {
      project.status = 'disputed';
      this.saveData();
    }
  }

  getPitches() {
    return this.projects.filter(
      (p) => p.fundingGoal && (p.raisedAmount || 0) < p.fundingGoal,
    );
  }

  fundProject(id: string, amount: number, investorId: string) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    if (!project.fundingGoal) throw new Error('Not a pitching project');

    // Deduct from investor balance
    const success = this.investorsService.investFunds(investorId, amount);
    if (!success) throw new Error('Insufficient funds');

    project.raisedAmount = (project.raisedAmount || 0) + amount;
    this.saveData();
    return project;
  }

  getRecentTransactions() {
    return this.projects
      .filter((p) => p.status === 'completed')
      .map((p) => {
        const feeRate = this.settingsService.getPlatformFeeRate();
        const dividendRate = this.settingsService.getInvestorDividendRate();

        const platformFee = p.value * feeRate;
        return {
          id: p.id,
          project: p.name,
          value: p.value,
          fee: platformFee,
          admin: platformFee * (1 - dividendRate),
          investorPool: platformFee * dividendRate,
          date: new Date().toISOString(), // Mock date for now
        };
      });
  }

  // Complete Project and Trigger Payouts
  completeProject(id: string) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');

    // Allow re-completing for demo purposes, or check status
    // if (project.status === 'completed') return null;

    project.status = 'completed';

    const feeRate = this.settingsService.getPlatformFeeRate();
    const dividendRate = this.settingsService.getInvestorDividendRate();

    const platformFee = project.value * feeRate;
    const investorPool = platformFee * dividendRate;

    // 1. Distribute to Global Pool
    this.investorsService.distributePool(investorPool);

    // 2. Distribute Specific Dividend if Investor Funded
    if (project.investorId && project.investorDividend) {
      this.investorsService.payDividend(
        project.investorId,
        project.investorDividend,
      );
    }

    this.saveData();

    return {
      project,
      payouts: {
        platformFee,
        investorPool,
        specificDividend: project.investorDividend || 0,
      },
    };
  }

  delete(id: string) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index > -1) {
      const deleted = this.projects.splice(index, 1);
      this.saveData();
      return { message: 'Project deleted successfully', project: deleted[0] };
    }
    return { message: 'Project not found' };
  }
}
