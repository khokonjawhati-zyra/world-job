import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import AdvancedSearch from '../components/AdvancedSearch';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// --- Sub-Components ---


const DynamicStatsBar = () => {
    const stats = [
        "🚀 Live Funded Projects: 142",
        "✅ Total Verified Workers: 850+",
        "💰 Successful Payouts: $2.4M+",
        "🌍 Global Reach: 35 Countries"
    ];

    return (
        <div style={{ width: '100%', overflow: 'hidden', background: 'rgba(0,0,0,0.5)', padding: '10px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                style={{ display: 'flex', gap: '50px', whiteSpace: 'nowrap' }}
            >
                {[...stats, ...stats, ...stats].map((stat, i) => ( // Repeat for infinite scroll illusion
                    <span key={i} style={{ color: 'var(--neon-cyan)', fontSize: '1rem', fontWeight: 'bold' }}>
                        {stat}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const FeaturedInvestmentCarousel = () => {
    const projects = [
        { title: "AI Trading Bot V2", roi: "150%" },
        { title: "Eco-Friendly Housing", roi: "125%" },
        { title: "Quantum Encryption Tech", roi: "200%" }
    ];

    return (
        <div style={{ margin: '40px 0', width: '100%', maxWidth: '800px' }}>
            <h3 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>🔒 Premium Investment Opportunities</h3>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {projects.map((p, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="glass-panel"
                        style={{
                            width: '240px', padding: '20px', borderRadius: '15px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.8))',
                            border: '1px solid rgba(0, 255, 255, 0.2)',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <h4 style={{ color: 'var(--neon-lime)', marginBottom: '5px' }}>{p.title}</h4>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '15px' }}>ROI: {p.roi}</div>

                        {/* NDA Overlay */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            color: '#ccc', textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '2rem' }}>🔒</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px' }}>NDA Required<br />to View</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const TrustSecurityBadges = () => {
    const badges = [
        { icon: '🛡️', title: 'Escrow Guaranteed', desc: 'Funds held securely until milestones met.' },
        { icon: '📜', title: 'Digital NDA Protected', desc: 'IP legally protected via smart contracts.' },
        { icon: '⚖️', title: 'Liability Exempt', desc: 'Platform holds zero liability for outcomes.' }
    ];

    return (
        <div style={{ display: 'flex', gap: '30px', margin: '40px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
            {badges.map((b, i) => (
                <div key={i} style={{ textAlign: 'center', width: '200px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{b.icon}</div>
                    <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '5px' }}>{b.title}</h4>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>{b.desc}</p>
                </div>
            ))}
        </div>
    );
};

const InteractiveRoadmap = () => {
    const steps = [
        { title: "1. Pitch", desc: "Entrepreneurs submit detailed project proposals." },
        { title: "2. Fund", desc: "Investors review (NDA signed) and fund via Escrow." },
        { title: "3. Execute", desc: "Workers deliver milestones, funds released incrementally." },
        { title: "4. Split", desc: "Profits split 45/45/10 (Worker/Investor/Admin)." }
    ];
    const [activeStep, setActiveStep] = useState(null);

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '50px 0', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
            <h3 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>🚀 How The Hybrid Model Works</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', top: '25px', left: '0', width: '100%', height: '2px', background: '#333', zIndex: 0 }}></div>

                {steps.map((step, i) => (
                    <div key={i} style={{ zIndex: 1, textAlign: 'center', width: '22%' }}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setActiveStep(i)}
                            style={{
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: activeStep === i ? 'var(--neon-cyan)' : '#222',
                                border: `2px solid ${activeStep === i ? '#fff' : 'var(--neon-cyan)'}`,
                                margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', fontSize: '1.2rem', color: activeStep === i ? '#000' : '#fff'
                            }}
                        >
                            {i + 1}
                        </motion.div>
                        <h4 style={{ color: activeStep === i ? 'var(--neon-cyan)' : '#888' }}>{step.title}</h4>
                        <AnimatePresence>
                            {activeStep === i && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{ color: '#ccc', fontSize: '0.8rem', marginTop: '5px' }}
                                >
                                    {step.desc}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            <p style={{ textAlign: 'center', color: '#555', fontSize: '0.8rem', marginTop: '20px' }}>(Click nodes for details)</p>
        </div>
    );
};

// --- Main Page ---

const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch SEO Metadata from Backend
        fetch('http://localhost:3000/metadata/landing')
            .then(res => res.json())
            .then(meta => {
                document.title = meta.title;
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute("content", meta.description);
                // In a real SSR setup, this would be handled before hydration
            })
            .catch(err => console.error("Failed to load metadata", err));
    }, []);

    return (
        <div className="landing-container" style={{ overflowX: 'hidden' }}> {/* Ensure no horizontal scroll from animations */}
            <div className="bg-glow glow-top" style={{ pointerEvents: 'none' }}></div>
            <div className="bg-glow glow-bottom" style={{ pointerEvents: 'none' }}></div>

            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/auth" state={{ mode: 'login' }}>
                        <button style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Login
                        </button>
                    </Link>
                    <Link to="/auth" state={{ mode: 'signup' }}>
                        <button className="btn-neon" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '25px' }}>
                            Sign Up
                        </button>
                    </Link>
                </div>

                <select onChange={(e) => i18n.changeLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '5px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid #444' }}>
                    <option value="en">English</option>
                    <option value="bn">Bengali</option>
                </select>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="hero-section"
                style={{ marginBottom: '30px' }}
            >
                <h1 className="main-logo">
                    <span className="rainbow-text">W</span><span className="earth">🌎</span><span className="rainbow-text">RLD J</span><span className="earth">🌎</span><span className="rainbow-text">B</span>
                </h1>
                <motion.p
                    className="slogan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    {t('welcome')}
                </motion.p>

                <div style={{ margin: '30px 0', width: '100%' }}>
                    <AdvancedSearch onSearch={(params) => console.log(params)} />
                </div>
            </motion.div>

            {/* Dynamic Stats Bar */}
            <DynamicStatsBar />

            <motion.div
                className="role-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{ marginTop: '40px' }}
            >
                <div className="role-card worker-card" style={{ cursor: 'default' }}>
                    <div className="card-content">
                        <h2>Worker</h2>
                        <p>Find Jobs & Projects</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', position: 'relative', zIndex: 9999 }}>
                            <button onClick={() => navigate('/worker')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #fff', color: '#fff', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', pointerEvents: 'auto' }}>Login</button>
                            <button onClick={() => navigate('/auth', { state: { mode: 'signup', role: 'WORKER' } })} className="btn-neon" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', pointerEvents: 'auto' }}>Join</button>
                        </div>
                    </div>
                </div>

                <div className="role-card employer-card" style={{ cursor: 'default' }}>
                    <div className="card-content">
                        <h2>Employer</h2>
                        <p>Hire Top Talent</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', position: 'relative', zIndex: 9999 }}>
                            <button onClick={() => navigate('/employer')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #fff', color: '#fff', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', pointerEvents: 'auto' }}>Login</button>
                            <button onClick={() => navigate('/auth', { state: { mode: 'signup', role: 'EMPLOYER' } })} className="btn-neon" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', pointerEvents: 'auto' }}>Join</button>
                        </div>
                    </div>
                </div>

                <div className="role-card investor-card" style={{ cursor: 'default' }}>
                    <div className="card-content">
                        <h2>Investor</h2>
                        <p>Fund Projects & Earn</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', position: 'relative', zIndex: 9999 }}>
                            <button onClick={() => navigate('/investor')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #fff', color: '#fff', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', pointerEvents: 'auto' }}>Login</button>
                            <button onClick={() => navigate('/auth', { state: { mode: 'signup', role: 'INVESTOR' } })} className="btn-neon" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', pointerEvents: 'auto' }}>Join</button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* New Sections */}
            <FeaturedInvestmentCarousel />

            <InteractiveRoadmap />

            <TrustSecurityBadges />

            <div style={{ height: '50px' }}></div> {/* Spacer */}

            <Footer />
        </div>
    );
};

export default LandingPage;
