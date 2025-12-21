
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Re-use the same styles for consistency
import Logo from '../components/Logo';

const AdminLanding = () => {
    return (
        <div className="landing-container">
            <div className="bg-glow glow-top"></div>
            <div className="bg-glow glow-bottom"></div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="hero-section"
            >
                {/* Logo Section */}
                <div style={{ transform: 'scale(1.2)', marginBottom: '20px' }}>
                    <Logo />
                </div>

                <h1 className="main-logo" style={{ fontSize: '2.5rem' }}>
                    <span className="rainbow-text">ADMIN</span> <span style={{ color: '#fff' }}>PORTAL</span>
                </h1>
                <p className="slogan">System Control & Management Center</p>
            </motion.div>

            <motion.div
                className="role-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ justifyContent: 'center' }}
            >
                <Link to="/admin-login" className="role-card" style={{ borderColor: 'var(--neon-purple)', maxWidth: '400px' }}>
                    <div className="card-content">
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛡️</div>
                        <h2 style={{ color: 'var(--neon-purple)' }}>Super Admin</h2>
                        <p>Access Full System Control</p>
                        <span className="arrow" style={{ color: 'var(--neon-purple)' }}>→</span>
                    </div>
                </Link>
            </motion.div>

            <div className="footer-link">
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default AdminLanding;
