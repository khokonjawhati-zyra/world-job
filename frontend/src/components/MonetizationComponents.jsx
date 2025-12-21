
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AdWidget = ({ role }) => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/monetization/ads?role=${role}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAds(data);
                } else {
                    setAds([]);
                }
            })
            .catch(err => {
                console.error(err);
                setAds([]);
            });
    }, [role]);

    if (ads.length === 0) return null;

    // Pick a random ad
    const ad = ads[Math.floor(Math.random() * ads.length)];

    return (
        <div style={{ marginTop: '20px', padding: '15px', background: 'linear-gradient(45deg, #111, #222)', borderRadius: '15px', border: '1px solid #444', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#888', display: 'block', textAlign: 'right', marginBottom: '5px' }}>Sponsored</span>
            <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{ad.brand}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)', marginBottom: '10px' }}>{ad.title}</div>
            <button className="btn-neon" style={{ fontSize: '0.8rem', width: '100%' }}>Shop Now</button>
        </div>
    );
};

export const SubscriptionPlans = ({ role, onClose, onBalanceUpdate }) => {
    const [plans, setPlans] = useState([]);
    const [currentPlanId, setCurrentPlanId] = useState(null);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        // Fetch Plans
        fetch(`http://localhost:3000/monetization/plans?role=${role}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlans(data);
                } else {
                    setPlans([]);
                }
            })
            .catch(err => {
                console.error(err);
                setPlans([]);
            });

        // Fetch Current Subscription
        const targetUserId = role === 'employer' ? '201' : '101';
        fetch(`http://localhost:3000/monetization/subscription/${targetUserId}`)
            .then(res => res.text())
            .then(text => text ? JSON.parse(text) : null)
            .then(data => {
                // Backend returns the plan object or null
                if (data && data.id) {
                    setCurrentPlanId(data.id);
                }
            })
            .catch(console.error);
    }, [role]);

    const handleSubscribe = (planId) => {
        if (processing) return;
        setProcessing(planId);

        const userId = role === 'employer' ? '201' : '101';
        fetch('http://localhost:3000/monetization/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, planId })
        })
            .then(res => res.json())
            .then(data => {
                // Success
                setCurrentPlanId(planId);
                setProcessing(null);
                if (onBalanceUpdate) onBalanceUpdate();
                // Optional: Show a toast? For now, the button state change is feedback enough.
                // We won't close automatically so user sees the "Current Plan" status.
            })

            .catch(err => {
                console.error(err);
                setProcessing(null);
                alert("Subscription failed. Please try again.");
            });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
            <div className="glass-panel" style={{ width: '800px', maxWidth: '95vw', padding: '40px', borderRadius: '25px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--neon-cyan)' }}>Upgrade Your Experience</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>Select a plan that suits your needs</p>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: '20px' }}>
                    {plans.map(plan => {
                        const isCurrent = currentPlanId === plan.id;
                        const isProcessing = processing === plan.id;
                        // Fallback: if no subscription found, assume the 0-price plan is visually "Default" but not necessarily "Subscribed" in backend terms unless we want to force it.
                        // Actually, better to just rely on currentPlanId.

                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    padding: '30px',
                                    background: plan.price > 0 ? 'linear-gradient(180deg, rgba(0,255,255,0.1), rgba(0,0,0,0.3))' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '20px',
                                    border: (plan.price > 0 || isCurrent) ? '1px solid var(--neon-cyan)' : '1px solid #333',
                                    display: 'flex', flexDirection: 'column',
                                    boxShadow: isCurrent ? '0 0 15px rgba(0,229,255,0.3)' : 'none'
                                }}
                            >
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: plan.price > 0 ? '#fff' : '#aaa' }}>
                                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                    {plan.price > 0 && <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>/mo</span>}
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
                                    {plan.features.map((f, i) => (
                                        <li key={i} style={{ marginBottom: '10px', fontSize: '0.9rem', display: 'flex', gap: '10px' }}>
                                            <span style={{ color: 'var(--neon-lime)' }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => !isCurrent && handleSubscribe(plan.id)}
                                    className={plan.price > 0 && !isCurrent ? 'btn-neon' : ''}
                                    disabled={isCurrent || isProcessing}
                                    style={{
                                        width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px',
                                        background: isCurrent ? 'rgba(0, 255, 0, 0.2)' : plan.price > 0 ? 'var(--neon-cyan)' : 'transparent',
                                        border: isCurrent ? '1px solid var(--neon-lime)' : (plan.price > 0 ? 'none' : '1px solid #555'),
                                        color: isCurrent ? 'var(--neon-lime)' : (plan.price > 0 ? '#000' : '#fff'),
                                        cursor: (isCurrent || isProcessing) ? 'default' : 'pointer',
                                        opacity: isProcessing ? 0.7 : 1
                                    }}
                                >
                                    {isProcessing ? 'Processing...' : (isCurrent ? 'Current Plan' : (plan.price === 0 ? 'Basic Plan' : 'Upgrade Now'))}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
