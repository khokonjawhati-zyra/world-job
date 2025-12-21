import React, { useState } from 'react';

const EmployerEmergencyPanel = () => {
    const [request, setRequest] = useState({ title: '', location: '', workersNeeded: 10, skills: '' });

    const handleSubmit = () => {
        // Send to backend
        alert("Emergency Request Submitted. An Admin will review immediately.");
        setRequest({ title: '', location: '', workersNeeded: 10, skills: '' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', background: 'linear-gradient(to right, #001a33, #000)' }}>
                <h2 style={{ color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🚨 Corporate & Agency Emergency Response
                </h2>
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    <BenefitCard icon="🌍" title="Rapid Mobilization" desc="Deploy 100+ verified workers in under 2 hours." />
                    <BenefitCard icon="🛰️" title="Live Workforce Tracking" desc="GPS-enabled check-ins and safety monitoring." />
                    <BenefitCard icon="🔐" title="Compliance & ID Verified" desc="Automated background checks and insurance." />
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3 style={{ marginBottom: '20px' }}>Request Emergency Support Team</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Operation Name</label>
                        <input
                            style={inputStyle}
                            placeholder="e.g. Warehouse Storm Recovery"
                            value={request.title}
                            onChange={e => setRequest({ ...request, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Location / Site</label>
                        <input
                            style={inputStyle}
                            placeholder="City, State or GPS Coords"
                            value={request.location}
                            onChange={e => setRequest({ ...request, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Workers Needed</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={request.workersNeeded}
                            onChange={e => setRequest({ ...request, workersNeeded: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Required Skills</label>
                        <input
                            style={inputStyle}
                            placeholder="e.g. Heavy Lifting, First Aid"
                            value={request.skills}
                            onChange={e => setRequest({ ...request, skills: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="btn-neon"
                    style={{ marginTop: '20px', width: '100%', padding: '15px' }}
                >
                    INITIATE DEPLOYMENT REQUEST
                </button>
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

const labelStyle = { display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '8px', color: '#fff' };

export default EmployerEmergencyPanel;
