import { Injectable } from '@nestjs/common';

export interface WorkerProfile {
  id: number;
  name: string;
  skills: string[];
  experience: number;
  bio: string;
  rating: number;
  projectsCompleted: number;
}

export interface JobPost {
  id: number;
  title: string;
  requiredSkills: string[];
  description: string;
  minExperience: number;
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

@Injectable()
export class MatchingService {
  // Mock Data (In a real app, this would be injected via a Repository)
  private workers: WorkerProfile[] = [
    {
      id: 1,
      name: 'Alice Dev',
      skills: ['React', 'JavaScript', 'CSS'],
      experience: 4,
      bio: 'Frontend expert with a love for pixel perfect UI.',
      projectsCompleted: 12,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Bob Backend',
      skills: ['Node.js', 'Python', 'SQL'],
      experience: 6,
      bio: 'Heavy lifting on the server side.',
      projectsCompleted: 30,
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Charlie Fullstack',
      skills: ['React', 'Node.js', 'MongoDB', 'Typescript'],
      experience: 5,
      bio: 'I build end-to-end applications.',
      projectsCompleted: 20,
      rating: 4.7,
    },
  ];

  private jobs: JobPost[] = [
    {
      id: 1,
      title: 'Senior React Developer',
      requiredSkills: ['React', 'JavaScript'],
      minExperience: 4,
      description: 'Lead our frontend team building a new dashboard project.',
    },
    {
      id: 2,
      title: 'Python Data Analyst',
      requiredSkills: ['Python', 'SQL'],
      minExperience: 2,
      description: 'Analyze large datasets and generate reports.',
    },
  ];

  calculateMatchScore(worker: WorkerProfile, job: JobPost): MatchResult {
    let score = 0;
    const reasons: string[] = [];

    // 1. Skill Matching
    const workerSkills = worker.skills.map((s) => s.toLowerCase());
    const jobSkills = job.requiredSkills.map((s) => s.toLowerCase());
    let matchedSkillsCount = 0;

    jobSkills.forEach((skill) => {
      if (workerSkills.includes(skill)) {
        score += 20;
        matchedSkillsCount++;
      }
    });

    if (matchedSkillsCount > 0) {
      reasons.push(`${matchedSkillsCount} Matching Skills`);
    }

    // 2. Keyword Matching
    const jobTerms = job.description.toLowerCase().split(/\W+/);
    const workerTerms = worker.bio.toLowerCase().split(/\W+/);
    const keywordMatches = jobTerms.filter(
      (term) => term.length > 3 && workerTerms.includes(term),
    ).length;
    score += keywordMatches * 2;

    // 3. Experience Match
    if (worker.experience >= job.minExperience) {
      score += 15;
      reasons.push('Experience Match');
    } else {
      score -= 10;
    }

    // 4. Past Performance
    if (worker.rating >= 4.5) {
      score += 15;
      reasons.push('Top Rated Talent');
    }

    // 5. Fairness Boost
    if (
      worker.projectsCompleted < 5 &&
      matchedSkillsCount >= jobSkills.length * 0.8
    ) {
      score += 15;
      reasons.push('Rising Star');
    }

    return {
      score: Math.max(0, Math.min(score, 100)),
      reasons,
    };
  }

  getRecommendedWorkers(
    job: JobPost,
  ): (WorkerProfile & { matchScore: number; matchReasons: string[] })[] {
    return this.workers
      .map((worker) => {
        const { score, reasons } = this.calculateMatchScore(worker, job);
        return { ...worker, matchScore: score, matchReasons: reasons };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  getRecommendedJobs(
    worker: WorkerProfile,
  ): (JobPost & { matchScore: number; matchReasons: string[] })[] {
    return this.jobs
      .map((job) => {
        const { score, reasons } = this.calculateMatchScore(worker, job);
        return { ...job, matchScore: score, matchReasons: reasons };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter((job) => job.matchScore > 20);
  }
  // AI Proposal Generator
  generateProposal(jobId: number, workerId: number): { proposal: string } {
    const job = this.jobs.find((j) => j.id === Number(jobId));
    const worker = this.workers.find((w) => w.id === Number(workerId));

    if (!job || !worker) {
      return {
        proposal: 'Could not generate proposal. Job or Worker not found.',
      };
    }

    const proposal = `Dear Hiring Manager,

I am excited to apply for the **${job.title}** position. With **${worker.experience} years of experience** and expertise in **${worker.skills.join(', ')}**, I am confident I can deliver high-quality results.

${worker.bio}

I look forward to discussing how I can contribute to your project.

Best regards,
${worker.name}`;

    return { proposal };
  }

  // AI Pricing Recommendation
  getPricingRecommendation(job: Partial<JobPost>): {
    min: number;
    max: number;
    currency: string;
  } {
    // Mock logic based on experience and skills
    const baseRate = 20;
    const skillPremium = (job.requiredSkills?.length || 0) * 5;
    const expPremium = (job.minExperience || 0) * 10;

    const min = baseRate + skillPremium + expPremium;
    const max = min * 1.5;

    return { min, max, currency: 'USD' };
  }
}
