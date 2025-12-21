import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WorkerEmergencyPanel = () => {
    const [alerts, setAlerts] = useState([]);
    const [deployed, setDeployed] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/emergency/active')
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(console.error);
    }, []);

    const handleVolunteer = (id) => {
        if (!window.confirm("Confirm you are ready to deploy immediately?")) return;
        setDeployed(true);
        // In real app, post to /emergency/volunteer
    };

    if (deployed) {
        return (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', border: '2px solid #0f0' }}>
                <h1 style={{ fontSize: '3rem', margin: '20px 0' }}>✅</h1>
                <h2>You are DEPLOYED</h2>
                <p>Please proceed to the designated assembly point.</p>
                <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(0,255,0,0.1)', borderRadius: '10px' }}>
                    <strong>Active Mission:</strong> Flood Response - Region A
                </div>
                <button
                    onClick={() => setDeployed(false)}
                    className="btn-neon"
                >
                    Check Out / End Shift
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header / Intro */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', background: 'linear-gradient(to right, #400000, #1a0505)' }}>
                <h2 style={{ color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🚨 Emergency Response Corps
                </h2>
                <p style={{ marginTop: '10px', lineHeight: '1.6', color: '#ffaaaa' }}>
                    Join the elite rapid-response team. Serve your community during crises and earn premium hazard pay.
                </p>

                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    <BenefitCard icon="⚡" title="Priority Deployment" desc="First access to high-urgency tasks." />
                    <BenefitCard icon="💰" title="Hazard Pay & Bonuses" desc="Earn up to 2x rates for critical missions." />
                    <BenefitCard icon="🛡️" title="Verified Safety" desc="Full insurance and safety protocols provided." />
                </div>
            </div>

            {/* Active Alerts */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3 style={{ marginBottom: '20px' }}>Active Emergency Alerts</h3>
                {alerts.length === 0 ? (
                    <p style={{ color: '#aaa' }}>No active emergencies requiring mobilization at this time.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {alerts.map(alert => (
                            <div key={alert.id} style={{
                                padding: '20px',
                                border: '1px solid #ff4d4d',
                                borderRadius: '10px',
                                background: 'rgba(255, 0, 0, 0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ color: '#fff' }}>{alert.title}</h3>
                                    <p style={{ color: '#ffaaaa', margin: '5px 0' }}>📍 {alert.location} • ⚠️ {alert.severity} Severity</p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        {alert.requiredSkills && alert.requiredSkills.map(s => (
                                            <span key={s} style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleVolunteer(alert.id)}
                                    className="btn-neon"
                                    style={{ background: '#ff4d4d', border: 'none', color: '#fff' }}
                                >
                                    VOLUNTEER NOW
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BenefitCard = ({ icon, title, desc }) => (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{icon}</div>
        <h4 style={{ marginBottom: '5px', color: '#fff' }}>{title}</h4>
        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>{desc}</p>
    </div>
);

export default WorkerEmergencyPanel;
