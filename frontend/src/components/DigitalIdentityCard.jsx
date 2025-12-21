import React, { useState, useEffect } from 'react';

const DigitalIdentityCard = ({ userId }) => {
    const [identity, setIdentity] = useState(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        // Use relative path for config or default to localhost if not imported, 
        // but primarily rely on catch block for demo mode.
        fetch(`http://localhost:3001/identity/${userId}`)
            .then(res => res.json())
            .then(data => setIdentity(data))
            .catch(err => {
                console.warn("Identity Fetch Failed (Demo Mode):", err);
                // Mock Fallback
                setIdentity({
                    status: 'verified',
                    globalId: `WID-${userId}-GLOBAL-882`,
                    fullName: 'Demo User ' + userId,
                    immutableHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
                    trustScore: 94,
                    riskScore: 2,
                    verificationBadges: ['biometric', 'gov-id', 'social-graph']
                });
            });
    }, [userId]);

    const handleVerify = () => {
        setVerifying(true);
        // Simulate AI Scan with delay
        setTimeout(() => {
            fetch('http://localhost:3001/identity/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workerId: userId })
            })
                .then(res => res.json())
                .then(data => {
                    setIdentity(prev => ({ ...prev, ...data }));
                    setVerifying(false);
                })
                .catch(err => {
                    console.error(err);
                    setVerifying(false);
                });
        }, 2000);
    };

    if (!identity) return <div className="glass-panel">Loading Identity...</div>;

    return (
        <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,40,0.9))',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '25px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
        }}>
            {/* Holographic Header Effect */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                background: 'linear-gradient(90deg, transparent, cyan, transparent)',
                animation: 'scan 3s infinite linear'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'cyan', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Digital Identity
                </h3>
                <div style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: identity.status === 'verified' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                    color: identity.status === 'verified' ? '#0f0' : '#f00',
                    border: identity.status === 'verified' ? '1px solid #0f0' : '1px solid #f00',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    {identity.status.toUpperCase()}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Global Worker ID</div>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#fff', letterSpacing: '1px' }}>
                        {identity.globalId}
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Full Name</div>
                        <div style={{ fontSize: '1.1rem', color: '#fff' }}>{identity.fullName}</div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Immutable Hash</div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                            {identity.immutableHash}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>TRUST SCORE</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: identity.trustScore > 80 ? 'cyan' : 'orange' }}>
                            {identity.trustScore}
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>RISK SCORE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: identity.riskScore < 20 ? '#0f0' : 'red' }}>
                            {identity.riskScore}%
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '10px' }}>AI Verification Analysis</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {identity.verificationBadges.map(badge => (
                        <span key={badge} style={{
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            background: 'rgba(0,255,255,0.1)',
                            border: '1px solid cyan',
                            borderRadius: '15px',
                            color: 'cyan'
                        }}>
                            ✔ {badge.toUpperCase()}
                        </span>
                    ))}
                    {!identity.verificationBadges.includes('voice') && (
                        <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#333', borderRadius: '15px', color: '#666' }}>Voice Data Missing</span>
                    )}
                </div>
            </div>

            <button
                onClick={handleVerify}
                disabled={verifying}
                className="btn-neon"
                style={{
                    marginTop: '20px',
                    width: '100%',
                    background: verifying ? 'transparent' : 'rgba(0, 255, 255, 0.2)',
                    borderColor: 'cyan',
                    color: 'cyan'
                }}
            >
                {verifying ? 'AI SCANNING PROFILE...' : 'RUN AI DIAGNOSTIC & VERIFY'}
            </button>
        </div>
    );
};

export default DigitalIdentityCard;
