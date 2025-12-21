import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this exists or simplify
import TermsPage from './pages/TermsPage';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import UserProfile from './pages/UserProfile';

// Import Admin Components from new location
import AdminDashboard from './admin/AdminDashboard';
import AdminLanding from './admin/AdminLanding';
import AdminLoginPage from './admin/AdminLoginPage';

// Ensure global styles are active
import './index.css';

function App() {
  console.log("App Version: MobileFix-v2 (Wildcard CORS + SSL Prod URL) - Loaded at " + new Date().toISOString());
  return (
    <Router>
      <Routes>
        {/* Dynamic Root: Split Landing based on Domain/Subdomain */}
        <Route path="/" element={
          (window.location.hostname.includes('admin-portal') || window.location.hostname.includes('admin.'))
            ? <AdminLanding />
            : <LandingPage />
        } />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* User Dashboards (Public for Demo/Dev Access) */}
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/buyer" element={<EmployerDashboard />} />
        <Route path="/investor" element={<InvestorDashboard />} />
        <Route path="/profile/:role/:userId" element={<UserProfile />} />

        {/* Admin Public Routes */}
        <Route path="/admin-portal" element={<AdminLanding />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Maintain Terms Page access */}
        <Route path="/terms" element={<TermsPage />} />

        {/* Catch-all: Redirect unknown pages to Home instead of Admin Login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <ChatWidget />
    </Router>
  );
}

export default App;
