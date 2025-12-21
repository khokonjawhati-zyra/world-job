const isProduction = window.location.hostname !== 'localhost';

// For local preview provided by the user, we default to the production backend directly if on localhost
export const API_BASE_URL = 'https://world-job-backend.vercel.app';
// export const API_BASE_URL = isProduction
//     ? (import.meta.env.VITE_API_URL || 'https://world-job-backend.vercel.app')
//     : 'http://localhost:3001';
