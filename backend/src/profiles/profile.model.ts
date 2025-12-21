export class WorkerProfile {
  constructor(
    public userId: string,
    public name: string,
    public title: string, // e.g. Senior Full Stack Dev
    public bio: string,
    public email: string,
    public skills: string[],
    public languages: string[],
    public portfolio: {
      title: string;
      link: string;
      description?: string;
      image?: string;
    }[],
    public experience: number, // years
    public education: { degree: string; school: string; year: string }[],
    public certifications: { name: string; issuer: string; date: string }[],
    public hourlyRate: number,
    public availability: 'Full-time' | 'Part-time' | 'Contract' | 'Unavailable',
    public socialLinks: {
      linkedin?: string;
      github?: string;
      website?: string;
    },
    public performanceHistory: {
      projectId: string;
      rating: number;
      feedback: string;
    }[],
    public verified: boolean,
    public profileImage?: string,
    public bannerImage?: string,
    public documents: string[] = [], // URLs to uploaded docs
    public careerLevel:
      | 'Helper'
      | 'Skilled'
      | 'Professional'
      | 'Master' = 'Helper',
    public xp: number = 0,
    public endorsements: {
      skill: string;
      endorserId: string;
      endorserName: string;
      date: string;
    }[] = [],
  ) {}
}

export class EmployerProfile {
  constructor(
    public userId: string,
    public companyName: string,
    public website: string,
    public email: string,
    public industry: string,
    public size: string, // e.g. 10-50 employees
    public foundedYear: string,
    public bio: string,
    public postingHistory: { jobId: string; title: string; date: string }[],
    public workerFeedbackLog: {
      workerId: string;
      rating: number;
      comment: string;
    }[],
    public socialLinks: { linkedin?: string; twitter?: string },
    public verified: boolean,
    public logo?: string,
    public bannerImage?: string,
    public documents: string[] = [], // URLs to uploaded docs
  ) {}
}

export class InvestorProfile {
  constructor(
    public userId: string,
    public name: string,
    public email: string,
    public bio: string,
    public investmentPreferences: {
      industries: string[];
      riskTolerance: 'Low' | 'Medium' | 'High';
    },
    public investmentPortfolio: {
      projectId: string;
      amount: number;
      return: number;
    }[],
    public totalInvested: number,
    public financialVerificationStatus: 'pending' | 'verified' | 'rejected',
    public linkedIn?: string,
    public profileImage?: string,
    public documents: string[] = [], // URLs to uploaded docs
    public preferences?: any, // mapping for frontend compatibility
    public totalAssetValue?: number, // mapping for frontend
    public contactEmail?: string, // mapping for frontend
    public socialLinks?: string, // mapping for frontend
    public portfolio?: any[], // mapping for frontend
    public kycStatus?: string, // mapping for frontend
  ) {}
}

export class AdminProfile {
  constructor(
    public userId: string,
    public name: string,
    public role: 'super_admin' | 'moderator',
    public accessLog: string[],
  ) {}
}
