
import React, { useState, useEffect } from 'react';

const AdminPaymentControl = () => {
    const [milestones, setMilestones] = useState([]);
    const [laborPayments, setLaborPayments] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            fetch('http://localhost:3001/projects/admin/pending-releases').then(res => res.json()),
            fetch('http://localhost:3001/labor/admin/pending-payments').then(res => res.json()),
            fetch('http://localhost:3001/payment/admin/withdrawals').then(res => res.json())
        ]).then(([mArgs, lArgs, wArgs]) => {
            setMilestones(mArgs);
            setLaborPayments(lArgs);
            const pendingWithdrawals = Array.isArray(wArgs) ? wArgs.filter(w => w.status === 'PENDING') : [];
            setWithdrawals(pendingWithdrawals);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    const handleWithdrawalAction = (id, action) => {
        if (!confirm(`Are you sure you want to ${action.toUpperCase()} this withdrawal?`)) return;
        fetch(`http://localhost:3001/payment/admin/withdrawal/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        }).then(res => res.json()).then(() => {
            alert(`Withdrawal ${action}d!`);
            fetchData();
        });
    };

    const handleReleaseMilestone = (projectId, milestoneId) => {
        if (!window.confirm("CONFIRM RELEASE? This will transfer funds to the worker.")) return;
        fetch(`http://localhost:3001/projects/admin/release/${projectId}/${milestoneId}`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                alert('Funds Released!');
                fetchData();
            });
    };

    const handleReleaseLabor = (jobId, workerId) => {
        if (!window.confirm("CONFIRM PAYMENT? This will transfer daily wage to the worker.")) return;
        fetch(`http://localhost:3001/labor/admin/release-payment/${jobId}/${workerId}`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                alert('Payment Released!');
                fetchData();
            });
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--neon-pink)' }}>⚠️ Payment Authorization Queue</h2>
                <button onClick={fetchData} className="btn-neon">Refresh Queue</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Milestone Releases */}
                <div>
                    <h3>Project Milestones (Pending Release)</h3>
                    {milestones.length === 0 ? <p style={{ color: '#888' }}>No pending project milestones.</p> : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {milestones.map(m => (
                                <div key={m.milestoneId} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', borderLeft: '3px solid var(--neon-cyan)' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Project: {m.projectName}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>{m.description}</strong>
                                        <span style={{ fontSize: '1.2rem', color: '#fff' }}>${m.amount}</span>
                                    </div>
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleReleaseMilestone(m.projectId, m.milestoneId)}
                                            style={{ background: 'var(--neon-green)', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Approve & Transfer Funds
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Daily Labor Payments */}
                <div>
                    <h3>Daily Labor Wages (Pending Verification)</h3>
                    {laborPayments.length === 0 ? <p style={{ color: '#888' }}>No pending labor payments.</p> : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {laborPayments.map(p => (
                                <div key={p.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', borderLeft: '3px solid orange' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Job ID: {p.jobId.substr(0, 8)}...</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Worker: #{p.workerId.substr(0, 4)}...</span>
                                        <span style={{ color: 'orange' }}>PENDING VERIFICATION</span>
                                    </div>
                                    <div style={{ marginTop: '5px', fontSize: '0.8rem' }}>
                                        Clocked Out: {new Date(p.checkOutTime).toLocaleString()}
                                    </div>
                                    {p.proofMedia.length > 0 && (
                                        <div style={{ margin: '5px 0' }}>
                                            <a href={p.proofMedia[0]} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)' }}>View Proof</a>
                                        </div>
                                    )}
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleReleaseLabor(p.jobId, p.workerId)}
                                            style={{ background: 'var(--neon-green)', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Verify & Pay Worker
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Wallet Withdrawals */}
                <div style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>Wallet Withdrawal Requests</h3>
                    {withdrawals.length === 0 ? <p style={{ color: '#888' }}>No pending withdrawals.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {withdrawals.map(w => (
                                <div key={w.id} style={{ padding: '20px', background: 'rgba(50,0,50,0.3)', borderRadius: '15px', border: '1px solid var(--neon-purple)' }}>
                                    <div style={{ display: 'flex', justifySelf: 'start', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🏦</span>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{w.methodId || 'Bank Transfer'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>Req ID: {w.id}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>
                                        {w.currency} {w.amount.toLocaleString()}
                                    </div>
                                    <div style={{ marginBottom: '15px', color: '#ccc', fontSize: '0.9rem' }}>
                                        Requested by User <strong>{w.userId}</strong><br />
                                        <small>{new Date(w.date).toLocaleString()}</small>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleWithdrawalAction(w.id, 'approve')}
                                            style={{ flex: 1, background: 'var(--neon-lime)', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}
                                        >
                                            Approve Payout
                                        </button>
                                        <button
                                            onClick={() => handleWithdrawalAction(w.id, 'reject')}
                                            style={{ flex: 1, background: 'rgba(255,0,0,0.2)', border: '1px solid red', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: 'red' }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentControl;
