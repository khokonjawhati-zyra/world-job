import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon, subtext }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: `1px solid ${color}`, minWidth: '200px', flex: 1 }}>
        <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{title}</h4>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>
            {value}
        </div>
        {subtext && <p style={{ fontSize: '0.8rem', color: color, marginTop: '5px' }}>{subtext}</p>}
    </div>
);

const GatewayList = () => {
    const [gateways, setGateways] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'LOCAL', category: 'MOBILE_BANKING', details: '' });

    const [error, setError] = useState(null);

    const fetchGateways = () => {
        fetch('https://world-job-backend.vercel.app/payment/admin/gateways')
            .then(res => {
                if (res.status === 404) throw new Error("Backend endpoint not found. Please restart the backend server.");
                if (!res.ok) throw new Error("Failed to fetch gateways");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setGateways(data);
                    setError(null);
                } else {
                    console.error("Invalid gateway data:", data);
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    };

    useEffect(() => {
        fetchGateways();
    }, []);

    const handleDelete = (id) => {
        if (!confirm('Remove this gateway?')) return;
        fetch(`https://world-job-backend.vercel.app/payment/admin/gateways/${id}/delete`, { method: 'POST' })
            .then(() => fetchGateways());
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('https://world-job-backend.vercel.app/payment/admin/gateways', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Payment method saved successfully');
                setShowModal(false);
                setFormData({ name: '', type: 'LOCAL', category: 'MOBILE_BANKING', details: '' });
                fetchGateways();
            } else if (res.status === 404) {
                alert('Error: Backend endpoint not found. Please RESTART the backend server to apply changes.');
            } else {
                alert('Failed to save payment method');
            }
        } catch (error) {
            console.error('Error saving method:', error);
            alert('Error saving method: ' + error.message);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Payment Gateways & Methods</h3>
                <button onClick={() => setShowModal(true)} className="btn-neon" style={{ fontSize: '0.9rem' }}>+ Add New Method</button>
            </div>

            {error && <div style={{ color: 'red', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>⚠️ {error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {gateways.map(g => (
                    <div key={g.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', borderLeft: `4px solid ${g.type === 'LOCAL' ? 'var(--neon-lime)' : 'var(--neon-cyan)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: 0 }}>{g.name}</h4>
                            <button onClick={() => handleDelete(g.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', margin: '5px 0' }}>{g.category} • {g.type}</div>
                        <p style={{ fontSize: '0.85rem', color: '#ddd' }}>{g.details}</p>
                    </div>
                ))}
                {gateways.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No active payment gateways defined.</p>}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '30px', width: '400px', borderRadius: '20px' }}>
                        <h3>Add Payment Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                            <input placeholder="Method Name (e.g. Bkash, Binance)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />

                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}>
                                <option value="LOCAL">Local (National)</option>
                                <option value="INTERNATIONAL">International</option>
                            </select>

                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}>
                                <option value="MOBILE_BANKING">Mobile Banking (Bkash/Nagad...)</option>
                                <option value="BANK">Bank Transfer</option>
                                <option value="CARD">Credit/Debit Card</option>
                                <option value="CRYPTO">Cryptocurrency</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <textarea placeholder="Payment Instructions / Account Details" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '5px', minHeight: '80px' }} />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleSubmit} className="btn-neon" style={{ flex: 1 }}>Save Method</button>
                                <button onClick={() => setShowModal(false)} style={{ padding: '10px', background: 'none', border: '1px solid #555', color: '#aaa', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminTreasuryPanel = () => {
    const [stats, setStats] = useState({
        totalLiquidity: 0,
        adminRevenue: 0,
        escrowFunds: 0,
        isSystemLocked: false
    });
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState(null); // 'deposit', 'withdraw', 'adjust'

    // Form States
    const [amount, setAmount] = useState('');
    const [targetUser, setTargetUser] = useState('');
    const [reason, setReason] = useState('');

    // Transaction Logs State
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('ALL'); // 'ALL', 'IN', 'OUT'

    const fetchStats = () => {
        setLoading(true);
        // Fetch Stats
        fetch('https://world-job-backend.vercel.app/payment/admin/treasury')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Fetch Transactions
        fetch('https://world-job-backend.vercel.app/payment/admin/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const [showLockModal, setShowLockModal] = useState(false);

    const handleSystemLockClick = () => {
        setShowLockModal(true);
    };

    const confirmSystemLock = async () => {
        setShowLockModal(false);
        const newStatus = !stats.isSystemLocked;

        try {
            const res = await fetch('https://world-job-backend.vercel.app/payment/admin/treasury/lock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locked: newStatus })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server returned ${res.status}: ${text}`);
            }

            const data = await res.json();
            setStats(prev => ({ ...prev, isSystemLocked: data.isSystemLocked }));
        } catch (err) {
            console.error("Lock Error:", err);
            alert("Failed to toggle lock: " + err.message);
        }
    };

    const handleActionSubmit = async () => {
        if (!amount) return alert("Enter amount");
        const val = Number(amount);

        let url = '';
        let payload = {};

        if (action === 'withdraw') {
            url = 'https://world-job-backend.vercel.app/payment/admin/treasury/withdraw';
            payload = { amount: val, currency: 'USD', method: 'Bank Transfer' };
        } else if (action === 'deposit') {
            url = 'https://world-job-backend.vercel.app/payment/admin/treasury/deposit';
            payload = { amount: val, currency: 'USD', note: reason || 'Manual Deposit' };
        } else if (action === 'adjust') {
            url = 'https://world-job-backend.vercel.app/payment/admin/balance/adjust';
            payload = {
                userId: targetUser,
                amount: val,
                currency: 'USD',
                type: val > 0 ? 'add' : 'subtract', // simplistic logic, maybe UI should split add/sub
                reason: reason || 'Admin Adjustment'
            };
            // Fix for adjust: backend expects type param, let's refine UI logic for adjust later or split
            // For now let's assume 'adjust' button handles both via sign? 
            // Better: Add/Subtract toggle in UI. 
            // Adjust payload below assumes backend handles it. 
            // Wait, backend explicitly needs 'add' or 'subtract'.
            payload.type = 'add'; // Defaulting to ADD for this snippet, see below for real UI fix
            if (val < 0) {
                payload.type = 'subtract';
                payload.amount = Math.abs(val);
            }
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const d = await res.json();
            if (d.error) throw new Error(d.error); // Or message
            alert('Action Successful');
            setAmount('');
            setReason('');
            setTargetUser('');
            setAction(null);
            fetchStats();
        } catch (e) {
            alert('Error: ' + e.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '300px', position: 'relative', paddingBottom: '300px' }}>
            {/* Header & Panic Button */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: stats.isSystemLocked ? '2px solid red' : '1px solid var(--glass-border)' }}>
                <div>
                    <h2 style={{ marginBottom: '5px' }}>Treasury & Fund Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Overview of global platform liquidity and reserves</p>
                </div>
                <div style={{ textAlign: 'right', position: 'relative', zIndex: 10 }}>
                    <p style={{ marginBottom: '10px', color: stats.isSystemLocked ? 'red' : 'var(--neon-lime)', fontWeight: 'bold' }}>
                        SYSTEM STATUS: {stats.isSystemLocked ? 'LOCKED (Panic Mode)' : 'OPERATIONAL'}
                    </p>
                    <button
                        onClick={handleSystemLockClick}
                        style={{
                            background: stats.isSystemLocked ? '#333' : 'red',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: stats.isSystemLocked ? 'none' : '0 0 15px red',
                            position: 'relative',
                            zIndex: 20
                        }}
                    >
                        {stats.isSystemLocked ? 'UNLOCK SYSTEM' : '⛔ PANIC LOCK'}
                    </button>
                </div>
            </div>

            {/* Lock Confirmation Modal */}
            {showLockModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.85)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: '#1a1a1a', padding: '40px', borderRadius: '20px',
                            border: '1px solid var(--neon-pink)', maxWidth: '400px', textAlign: 'center',
                            boxShadow: '0 0 30px rgba(255,0,0,0.3)'
                        }}
                    >
                        <h2 style={{ color: 'var(--neon-pink)', marginBottom: '15px' }}>
                            {stats.isSystemLocked ? 'UNLOCK SYSTEM?' : '⚠ INITIATE PANIC LOCK?'}
                        </h2>
                        <p style={{ color: '#ccc', marginBottom: '30px', lineHeight: '1.5' }}>
                            {stats.isSystemLocked
                                ? "This will resume all withdrawal operations. Users will be able to withdraw funds again."
                                : "This will IMMEDIATELY FREEZE all active withdrawal requests. No funds can leave the system."}
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowLockModal(false)}
                                style={{
                                    padding: '12px 24px', borderRadius: '10px',
                                    background: 'transparent', border: '1px solid #555', color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSystemLock}
                                className="btn-neon"
                                style={{
                                    padding: '12px 24px', borderRadius: '10px',
                                    background: stats.isSystemLocked ? 'var(--neon-green)' : 'red',
                                    color: '#fff', border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {stats.isSystemLocked ? 'CONFIRM UNLOCK' : 'CONFIRM LOCK'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Stats Overview */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <StatCard
                    title="Platform Liquidity"
                    value={`$${Number(stats.totalLiquidity).toLocaleString()}`}
                    color="var(--neon-cyan)"
                    subtext="Total circulating user funds"
                />
                <StatCard
                    title="Treasury Revenue"
                    value={`$${Number(stats.adminRevenue).toLocaleString()}`}
                    color="var(--neon-lime)"
                    subtext="Accumulated Fees & Commissions"
                />
                <StatCard
                    title="Active Escrow"
                    value={`$${Number(stats.escrowFunds).toLocaleString()}`}
                    color="gold"
                    subtext="Locked in active contracts"
                />
            </div>

            {/* Operations Panel */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Fund Operations</h3>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <button onClick={() => setAction(action === 'deposit' ? null : 'deposit')} className="btn-neon" style={{ background: action === 'deposit' ? 'var(--neon-lime)' : 'transparent', color: action === 'deposit' ? '#000' : 'var(--neon-lime)', borderColor: 'var(--neon-lime)' }}>📥 Deposit Funds</button>
                    <button onClick={() => setAction(action === 'withdraw' ? null : 'withdraw')} className="btn-neon" style={{ background: action === 'withdraw' ? 'cyan' : 'transparent', color: action === 'withdraw' ? '#000' : 'cyan', borderColor: 'cyan' }}>📤 Withdraw Profits</button>
                    <button onClick={() => setAction(action === 'adjust' ? null : 'adjust')} className="btn-neon" style={{ background: action === 'adjust' ? 'orange' : 'transparent', color: action === 'adjust' ? '#000' : 'orange', borderColor: 'orange' }}>🔧 User Adjustment</button>
                </div>

                {action && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px' }}>
                        <h4 style={{ marginBottom: '15px', textTransform: 'capitalize' }}>{action} Operation</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Amount (USD)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
                                />
                                {action === 'adjust' && <small style={{ color: '#aaa' }}>Use negative value to subtract</small>}
                            </div>

                            {action === 'adjust' && (
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Target User ID</label>
                                    <input
                                        type="text"
                                        value={targetUser}
                                        onChange={e => setTargetUser(e.target.value)}
                                        placeholder="e.g. 101"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
                                    />
                                </div>
                            )}

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Note / Reason / Method</label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder={action === 'withdraw' ? "Bank Name / Method" : "Reason for transaction..."}
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button onClick={handleActionSubmit} className="btn-neon" style={{ flex: 1 }}>Confirm {action.toUpperCase()}</button>
                            <button onClick={() => setAction(null)} style={{ padding: '10px', background: 'none', border: '1px solid #555', color: '#aaa', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Gateway Management Panel */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>


                <GatewayList />
            </div>

            {/* Transaction Log */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Global Transaction Breakdown</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['ALL', 'IN', 'OUT'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '5px',
                                    border: '1px solid #444',
                                    background: filter === f ? 'var(--neon-cyan)' : 'transparent',
                                    color: filter === f ? '#000' : '#888',
                                    cursor: 'pointer'
                                }}
                            >
                                {f === 'ALL' ? 'All Transactions' : f === 'IN' ? 'Inflows (Deposits)' : 'Outflows (Payouts)'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', position: 'sticky', top: 0, background: '#000' }}>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th>Transaction ID</th>
                                <th>User</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Flow</th>
                                <th>Status</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!Array.isArray(transactions) || transactions.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No transactions found</td></tr>
                            ) : (
                                transactions
                                    .filter(t => filter === 'ALL' || t.flow === filter)
                                    .map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '10px' }}>{new Date(t.timestamp).toLocaleDateString()} <small>{new Date(t.timestamp).toLocaleTimeString()}</small></td>
                                            <td style={{ fontFamily: 'monospace', color: '#666' }}>{t.id}</td>
                                            <td>{t.userId}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{t.type.replace('_', ' ').toLowerCase()}</td>
                                            <td style={{ fontWeight: 'bold', color: t.flow === 'IN' ? 'var(--neon-green)' : 'var(--neon-pink)' }}>
                                                {t.flow === 'IN' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: t.flow === 'IN' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                                                    color: t.flow === 'IN' ? 'var(--neon-green)' : 'var(--neon-pink)',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {t.flow}
                                                </span>
                                            </td>
                                            <td>{t.status}</td>
                                            <td style={{ color: '#aaa', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default AdminTreasuryPanel;
