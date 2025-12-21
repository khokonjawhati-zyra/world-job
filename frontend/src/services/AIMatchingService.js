
// This service simulates an intelligent AI Matching Engine.
// In a production environment, this logic would reside on the backend, 
// likely using vector embeddings or a dedicated search/rank engine (e.g., Elasticsearch, Pinecone).

export const AIMatchingService = {
    /**
     * Calculates a matching score between a worker and a job.
     * @param {Object} worker - { skills: string[], experience: number, bio: string, rating: number, projectsCompleted: number }
     * @param {Object} job - { requiredSkills: string[], description: string, minExperience: number }
     * @returns {Object} - { score: number, reasons: string[] }
     */
    calculateMatchScore: (worker, job) => {
        let score = 0;
        let reasons = [];

        // 1. Skill Matching (Weight: High)
        // Check how many of the job's required skills the worker has.
        const workerSkills = worker.skills.map(s => s.toLowerCase());
        const jobSkills = job.requiredSkills.map(s => s.toLowerCase());

        let matchedSkillsCount = 0;
        jobSkills.forEach(skill => {
            if (workerSkills.includes(skill)) {
                score += 20; // High reward for direct skill match
                matchedSkillsCount++;
            }
        });

        if (matchedSkillsCount > 0) {
            reasons.push(`${matchedSkillsCount} Matching Skills`);
        }

        // 2. Semantic/Keyword Matching (Weight: Medium)
        // Check for keywords in bio/description if skills aren't explicit
        const jobTerms = job.description.toLowerCase().split(/\W+/);
        const workerTerms = worker.bio.toLowerCase().split(/\W+/);

        // Simple intersection count (could be improved with embeddings)
        const keywordMatches = jobTerms.filter(term => term.length > 3 && workerTerms.includes(term)).length;
        score += keywordMatches * 2;

        // 3. Experience Validation (Weight: Low/Constraint)
        if (worker.experience >= job.minExperience) {
            score += 15;
            reasons.push('Experience Match');
        } else {
            // Penalize but don't exclude (maybe they are a fast learner)
            score -= 10;
        }

        // 4. Past Performance (Weight: Medium)
        // Reward high ratings and project completion
        if (worker.rating >= 4.5) {
            score += 15;
            reasons.push('Top Rated Talent');
        }
        if (worker.projectsCompleted > 10) {
            score += 10;
        }

        // 5. Fairness & Opportunity Boost (Weight: Variable)
        // "Rising Star" - Ensure new workers with high aptitude aren't completely buried
        if (worker.projectsCompleted < 5 && matchedSkillsCount >= jobSkills.length * 0.8) {
            score += 15; // Increased boost
            reasons.push('Rising Star');
        }

        // Normalize Score (Mock cap at 100 for UI consistency)
        score = Math.min(score, 100);
        score = Math.max(score, 0);

        return { score, reasons };
    },

    /**
     * Suggests relevant jobs for a specific worker.
     * @param {Object} workerProfile 
     * @param {Array} allJobs 
     * @returns {Array} - Top matched jobs sorted by score.
     */
    getRecommendedJobs: (workerProfile, allJobs) => {
        const jobsWithScores = allJobs.map(job => {
            const { score, reasons } = AIMatchingService.calculateMatchScore(workerProfile, job);
            return {
                ...job,
                matchScore: score,
                matchReasons: reasons
            };
        });

        // Sort by score descending and return top suggestions
        return jobsWithScores
            .sort((a, b) => b.matchScore - a.matchScore)
            .filter(job => job.matchScore > 20); // Filter out low relevance
    },

    /**
     * Suggests relevant workers for a specific job.
     * @param {Object} jobOrJobId - If ID is provided, logic to fetch job would go here. For now assuming object.
     * @param {Array} allWorkers 
     * @returns {Array} - Top 5 matched workers.
     */
    getRecommendedWorkers: (job, allWorkers) => {
        const workersWithScores = allWorkers.map(worker => {
            const { score, reasons } = AIMatchingService.calculateMatchScore(worker, job);
            return {
                ...worker,
                matchScore: score,
                matchReasons: reasons
            };
        });

        return workersWithScores
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5); // Top 5
    }
};

// Mock Data for Simulation
export const MOCK_WORKERS = [
    { id: 1, name: "Alice Dev", skills: ["React", "JavaScript", "CSS"], experience: 4, bio: "Frontend expert with a love for pixel perfect UI.", projectsCompleted: 12, rating: 4.8 },
    { id: 2, name: "Bob Backend", skills: ["Node.js", "Python", "SQL"], experience: 6, bio: "Heavy lifting on the server side.", projectsCompleted: 30, rating: 4.9 },
    { id: 3, name: "Charlie Fullstack", skills: ["React", "Node.js", "MongoDB", "Typescript"], experience: 5, bio: "I build end-to-end applications.", projectsCompleted: 20, rating: 4.7 },
    { id: 4, name: "David Design", skills: ["Figma", "UI/UX", "CSS"], experience: 2, bio: "Creative designer transitioning to code.", projectsCompleted: 3, rating: 4.5 },
    { id: 5, name: "Eve AI", skills: ["Python", "TensorFlow", "Data Science"], experience: 8, bio: "Machine Learning specialist.", projectsCompleted: 45, rating: 5.0 },
    { id: 6, name: "Frankie Fresh", skills: ["React", "HTML"], experience: 1, bio: "Junior developer eager to learn.", projectsCompleted: 1, rating: 0 } // New user
];

export const MOCK_JOBS = [
    { id: 1, title: "Senior React Developer", requiredSkills: ["React", "JavaScript"], minExperience: 4, description: "Lead our frontend team building a new dashboard project." },
    { id: 2, title: "Python Data Analyst", requiredSkills: ["Python", "SQL"], minExperience: 2, description: "Analyze large datasets and generate reports." },
    { id: 3, title: "Full Stack Engineer", requiredSkills: ["React", "Node.js", "SQL"], minExperience: 5, description: "Build scalable web applications from scratch." },
    { id: 4, title: "Logo Designer", requiredSkills: ["Figma", "Adobe Illustrator"], minExperience: 1, description: "Create a modern logo for our startup." },
];
