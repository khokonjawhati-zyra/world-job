import { Injectable } from '@nestjs/common';
import {
  WorkerProfile,
  EmployerProfile,
  InvestorProfile,
  AdminProfile,
} from './profile.model';

@Injectable()
export class ProfilesService {
  // Mock Data
  private workerProfiles: WorkerProfile[] = [
    new WorkerProfile(
      '101',
      'Alice Dev',
      'Senior Full Stack Developer',
      'Passionate developer with 5+ years of experience in building scalable web applications. Expert in React and NestJS.',
      'alice@example.com',
      ['React', 'NestJS', 'TypeScript', 'Node.js', 'PostgreSQL'],
      ['English', 'Spanish'],
      [
        {
          title: 'E-commerce Platform',
          link: 'github.com/alice/shop',
          description:
            'A full-scale multi-vendor marketplace built with Next.js and Stripe.',
        },
        {
          title: 'Portfolio Site',
          link: 'alice.dev',
          description: 'Personal branding site with 3D animations.',
        },
      ],
      5,
      [
        {
          degree: 'BS Computer Science',
          school: 'Tech University',
          year: '2019',
        },
      ],
      [{ name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' }],
      50,
      'Full-time',
      { linkedin: 'linkedin.com/in/alice', github: 'github.com/alice' },
      [
        {
          projectId: '1',
          rating: 5,
          feedback: 'Excellent work, very communicative.',
        },
      ],
      true,
      undefined,
      undefined,
      [],
      'Professional',
      6500,
      [
        {
          skill: 'React',
          endorserId: '201',
          endorserName: 'Tech Startup Inc.',
          date: '2024-12-01',
        },
      ],
    ),
    new WorkerProfile(
      '102',
      'Bob Design',
      'UI/UX Designer',
      'Creative designer focused on user-centric interfaces. I make things look good and work well.',
      'bob@example.com',
      ['Figma', 'CSS', 'Adobe XD', 'Prototyping'],
      ['English'],
      [{ title: 'Finance App UI', link: 'dribbble.com/bob/finance' }],
      5,
      [{ degree: 'BA Graphic Design', school: 'Art School', year: '2018' }],
      [],
      45,
      'Contract',
      { linkedin: 'linkedin.com/in/bob' },
      [],
      true,
      undefined,
      undefined,
      [],
      'Skilled',
      2500,
    ),
  ];

  private employerProfiles: EmployerProfile[] = [
    new EmployerProfile(
      '201',
      'Tech Startup Inc.',
      'https://techstartup.com',
      'contact@techstartup.com',
      'Software & Technology',
      '11-50 employees',
      '2021',
      'We are a fast-growing startup building the future of remote work tools.',
      [{ jobId: '1', title: 'Need React Dev', date: '2025-01-10' }],
      [{ workerId: '101', rating: 5, comment: 'Great delivery' }],
      {
        linkedin: 'linkedin.com/company/techstartup',
        twitter: 'x.com/techstartup',
      },
      true,
    ),
  ];

  private investorProfiles: InvestorProfile[] = [
    new InvestorProfile(
      '301',
      'Charlie Capital',
      'charlie@cap.com',
      'Angel investor looking for high-growth SaaS opportunities in the Web3 and AI space.',
      { industries: ['SaaS', 'AI', 'Blockchain'], riskTolerance: 'High' },
      [{ projectId: '105', amount: 5000, return: 0 }],
      5000,
      'verified',
      'linkedin.com/in/charliecap',
    ),
    new InvestorProfile(
      '901',
      'Angel Investor 901',
      'investor901@example.com',
      'Experienced investor seeking unicorns in fintech and healthcare.',
      {
        industries: ['Fintech', 'Health', 'Consumer'],
        riskTolerance: 'Medium',
      },
      [],
      100000,
      'verified',
      'linkedin.com/in/angel901',
      '', // profileImage
      [], // documents
      {
        industries: ['Fintech', 'Health', 'Consumer'],
        riskTolerance: 'Medium',
      }, // preferences
      100000, // totalAssetValue
      'investor901@example.com', // contactEmail
      'linkedin.com/in/angel901', // socialLinks
      [], // portfolio
      'Verified', // kycStatus
    ),
  ];

  private adminProfiles: AdminProfile[] = [
    new AdminProfile('999', 'Super Admin', 'super_admin', [
      'Login at 10:00 AM',
    ]),
  ];

  getWorkerProfile(userId: string) {
    return this.workerProfiles.find((p) => p.userId === userId);
  }

  getEmployerProfile(userId: string) {
    return this.employerProfiles.find((p) => p.userId === userId);
  }

  getInvestorProfile(userId: string) {
    return this.investorProfiles.find((p) => p.userId === userId);
  }

  getAdminProfile(userId: string) {
    return this.adminProfiles.find((p) => p.userId === userId);
  }

  // Generic fetcher
  getProfile(userId: string, role: string) {
    switch (role) {
      case 'worker':
        return this.getWorkerProfile(userId);
      case 'employer':
        return this.getEmployerProfile(userId);
      case 'investor':
        return this.getInvestorProfile(userId);
      case 'admin':
        return this.getAdminProfile(userId);
      default:
        return null;
    }
  }

  updateProfileImage(userId: string, role: string, imagePath: string) {
    const profile: any = this.getProfile(userId, role);
    if (profile) {
      // Normalize path for frontend. Assuming uploads are served at root via static assets
      // actually they are served at /uploads/, so imagePath usually comes as 'uploads/filename'
      const publicUrl = `http://localhost:3001/${imagePath.replace(/\\/g, '/')}`;

      if (role === 'worker') profile.profileImage = publicUrl;
      if (role === 'employer') profile.logo = publicUrl;
      if (role === 'investor') profile.profileImage = publicUrl;

      return { success: true, url: publicUrl };
    }
    return { success: false, message: 'Profile not found' };
  }

  addDocument(userId: string, role: string, docPath: string) {
    const profile: any = this.getProfile(userId, role);
    if (profile) {
      const publicUrl = `http://localhost:3001/${docPath.replace(/\\/g, '/')}`;
      // Initialize if undefined (though model has default)
      if (!profile.documents) profile.documents = [];
      profile.documents.push(publicUrl);
      return { success: true, url: publicUrl, documents: profile.documents };
    }
    return { success: false, message: 'Profile not found' };
  }

  updateProfile(userId: string, role: string, updates: any) {
    const profile: any = this.getProfile(userId, role);
    if (profile) {
      Object.assign(profile, updates);
      return { success: true, profile };
    }
    return { success: false, message: 'Profile not found' };
  }

  // --- Career System ---

  addXP(userId: string, amount: number) {
    const profile = this.getWorkerProfile(userId);
    if (!profile) return { success: false, message: 'Worker not found' };

    profile.xp = (profile.xp || 0) + amount;

    // Recalculate Level
    // Helper: 0-1000, Skilled: 1001-5000, Professional: 5001-20000, Master: 20000+
    let newLevel: 'Helper' | 'Skilled' | 'Professional' | 'Master' = 'Helper';
    if (profile.xp > 20000) newLevel = 'Master';
    else if (profile.xp > 5000) newLevel = 'Professional';
    else if (profile.xp > 1000) newLevel = 'Skilled';

    if (profile.careerLevel !== newLevel) {
      profile.careerLevel = newLevel;
      // Could trigger notification here
    }

    return { success: true, xp: profile.xp, level: profile.careerLevel };
  }

  endorseSkill(
    workerId: string,
    skill: string,
    endorserId: string,
    endorserRole: string,
  ) {
    const worker = this.getWorkerProfile(workerId);
    if (!worker) throw new Error('Worker not found');

    let endorserName = 'Unknown';
    if (endorserRole === 'employer') {
      const emp = this.getEmployerProfile(endorserId);
      if (emp) endorserName = emp.companyName;
    }

    if (!worker.endorsements) worker.endorsements = [];

    // Check duplicate
    const exists = worker.endorsements.find(
      (e) => e.skill === skill && e.endorserId === endorserId,
    );
    if (exists) return { success: false, message: 'Already endorsed' };

    worker.endorsements.push({
      skill,
      endorserId,
      endorserName,
      date: new Date().toISOString(),
    });

    // Add some XP for endorsement?
    this.addXP(workerId, 50);

    return { success: true, endorsements: worker.endorsements };
  }
}
