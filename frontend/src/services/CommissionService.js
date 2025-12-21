
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const CommissionService = {
    // Configuration Constants
    CONSTANTS: {
        PLATFORM_FEE_PERCENT: 0.10,
        ADMIN_SHARE_PERCENT: 0.70,
        INVESTOR_POOL_PERCENT: 0.30
    },

    getInvestor: async (id) => {
        const response = await fetch(`${API_URL}/investors/${id}`);
        return response.json();
    },

    getRecentTransactions: async () => {
        const response = await fetch(`${API_URL}/projects/transactions`);
        return response.json();
    },

    getPitches: async () => {
        const response = await fetch(`${API_URL}/projects/pitches`);
        return response.json();
    },

    fundProject: async (id, amount) => {
        // Hardcoded investorId '1' for demo
        const response = await fetch(`${API_URL}/projects/${id}/fund/${amount}/1`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Funding failed');
        return response.json();
    },

    completeProject: async (id) => {
        const response = await fetch(`${API_URL}/projects/${id}/complete`, {
            method: 'POST'
        });
        return response.json();
    },

    // Keep helper for frontend calculations if needed
    calculateDividend: (totalInvestorPool, investorShares, totalSharesIssued) => {
        if (totalSharesIssued === 0) return 0;
        const ownershipPercentage = investorShares / totalSharesIssued;
        return totalInvestorPool * ownershipPercentage;
    }
};
