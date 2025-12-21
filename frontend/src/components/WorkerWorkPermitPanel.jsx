import React, { useState, useEffect } from 'react';

const WorkerWorkPermitPanel = ({ onBalanceUpdate }) => {
    // Mock Current User (Worker)
    const CURRENT_USER_ID = '101'; // Matches backend seed data
    const API_URL = 'http://localhost:3001';

    const [permits, setPermits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submissionInputs, setSubmissionInputs] = useState({});

    const handleInputChange = (permitId, field, value) => {
        setSubmissionInputs(prev => ({
            ...prev,
            [permitId]: {
                ...prev[permitId],
                [field]: value
            }
        }));
    };

    const handleFileChange = (permitId, file) => {
        setSubmissionInputs(prev => ({
            ...prev,
            [permitId]: {
                ...prev[permitId],
                fileName: file ? file.name : null
            }
        }));
    };

    useEffect(() => {
        fetchPermits();
    }, []);

    const fetchPermits = async () => {
        try {
            const res = await fetch(`${API_URL}/work-permit/user/WORKER/${CURRENT_USER_ID}`);
            const data = await res.json();
            setPermits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontFamily: "'Inter', sans-serif" },
        card: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
        tag: { fontSize: '13px', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', textTransform: 'capitalize' },
        title: { fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', margin: 0 },
        noticeBox: { backgroundColor: '#eff6ff', border: '1px solid #dbeafe', color: '#1e40af', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px', lineHeight: '1.5' },
        noticeIcon: { fontSize: '20px' },
        jobId: { fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '4px', margin: 0 },
        jobType: { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' },
        label: { fontSize: '13px', color: '#6b7280', marginBottom: '4px', margin: 0 },
        value: { color: '#111827', fontWeight: '500' },
        disputeBox: { marginTop: '16px', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' },
        disputeTitle: { fontSize: '12px', color: '#991b1b', fontWeight: '700', marginBottom: '4px', margin: 0 },
        disputeText: { fontSize: '14px', color: '#b91c1c', lineHeight: '1.4', margin: 0 },
        financialBox: { backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #d1fae5' },
        financialLabel: { fontSize: '12px', color: '#065f46', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px', margin: 0 },
        financialValue: { fontSize: '28px', fontWeight: '700', color: '#047857', marginBottom: '4px', letterSpacing: '-0.025em', margin: 0 },
        secureStatus: { fontSize: '13px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 },
        footer: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' },
        badgeActive: { backgroundColor: '#dcfce7', color: '#166534', fontSize: '13px', padding: '6px 16px', borderRadius: '20px', border: '1px solid #bbf7d0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' },
        badgePaid: { backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '13px', padding: '6px 16px', borderRadius: '20px', border: '1px solid #bfdbfe', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' },
        badgeWait: { backgroundColor: '#fffbeb', color: '#b45309', fontSize: '13px', padding: '6px 16px', borderRadius: '20px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '6px' }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
            case 'COMPLETED': return { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
            case 'DISPUTED': return { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
            default: return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
        }
    };

    if (loading) return <div>Loading Verified Permits...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Work Permits (Worker)</h2>
            <div style={styles.noticeBox}>
                <span style={styles.noticeIcon}>🛡️</span>
                <div>
                    <span style={{ fontWeight: '700' }}>Worker Safety Notice:</span> Only start work when a permit is <b>ACTIVE</b>.
                    This ensures your payment is fully secured in Escrow. If a permit is disputed, stop work immediately.
                </div>
            </div>

            {permits.length === 0 ? <p style={{ color: '#6b7280', fontSize: '16px', textAlign: 'center', padding: '32px 0' }}>No active work permits found.</p> : (
                permits.map(p => (
                    <div key={p.id} style={styles.card}>
                        {/* Header */}
                        <div style={styles.header}>
                            <div>
                                <h3 style={styles.jobId}>{p.title || `Job Reference: ${p.jobId}`}</h3>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                                    <span style={styles.jobType}>{p.jobType}</span>
                                    {p.title && <span style={{ fontSize: '12px', color: '#9ca3af' }}>Ref: {p.jobId}</span>}
                                </div>
                            </div>
                            <span style={{ ...styles.tag, ...getStatusStyle(p.status) }}>{p.status.replace(/_/g, ' ')}</span>
                        </div>

                        {/* Details Grid */}
                        <div style={styles.grid}>
                            {/* Left Column: Info */}
                            <div>
                                <p style={styles.label}><strong>Buyer ID:</strong> <span style={styles.value}>{p.buyerId}</span></p>
                                <p style={styles.label}><strong>Permit ID:</strong> <span style={styles.value}>{p.id}</span></p>
                                <p style={styles.label}><strong>Created:</strong> <span style={styles.value}>{new Date(p.createdAt).toLocaleDateString()}</span></p>

                                {p.description && (
                                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Scope of Work</p>
                                        <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{p.description}</p>
                                    </div>
                                )}

                                {p.status === 'DISPUTED' && (
                                    <div style={styles.disputeBox}>
                                        <p style={styles.disputeTitle}>⚠️ DISPUTE ACTIVE</p>
                                        <p style={styles.disputeText}>Payment is frozen. Please check 'My Job Requests' for dispute resolution steps.</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Financials */}
                            <div>
                                <div style={styles.financialBox}>
                                    <p style={styles.financialLabel}>Secured Net Payout</p>
                                    <p style={styles.financialValue}>{p.currency} {(p.totalAmount - p.adminCommission - p.platformFee).toLocaleString()}</p>
                                    <p style={styles.secureStatus}>
                                        <span style={{ fontSize: '16px' }}>🔒</span>
                                        {p.status === 'ACTIVE' ? 'Funds Secured in Escrow' :
                                            p.status === 'COMPLETED' ? 'Funds Available in Wallet' : 'Funds Pending Lock'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submission Section for ACTIVE permits */}
                        {p.status === 'ACTIVE' && (
                            <div style={{
                                marginTop: '20px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px dashed #cbd5e1',
                                padding: '16px'
                            }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px', marginTop: 0 }}>
                                    📤 Submit Project Deliverables
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input
                                        type="text"
                                        placeholder="🔗 Project URL (Google Drive, GitHub, Live Site)..."
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none'
                                        }}
                                        value={submissionInputs[p.id]?.link || ''}
                                        onChange={(e) => handleInputChange(p.id, 'link', e.target.value)}
                                    />

                                    <textarea
                                        placeholder="📝 Add notes, credentials, or instructions for the buyer..."
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minHeight: '60px', fontFamily: 'inherit'
                                        }}
                                        value={submissionInputs[p.id]?.notes || ''}
                                        onChange={(e) => handleInputChange(p.id, 'notes', e.target.value)}
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <label style={{
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1'
                                            }}>
                                                📎 Attach File
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(p.id, e.target.files[0])}
                                                />
                                            </label>
                                            {submissionInputs[p.id]?.fileName && (
                                                <span style={{ fontSize: '12px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {submissionInputs[p.id].fileName}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={async () => {
                                                const data = submissionInputs[p.id] || {};
                                                if (!data.link && !data.fileName && !data.notes) {
                                                    alert("Please provide at least a Link, Notes, or attach a File.");
                                                    return;
                                                }

                                                // Construct proof string
                                                const proofElements = [];
                                                if (data.link) proofElements.push(`URL: ${data.link}`);
                                                if (data.fileName) proofElements.push(`File: ${data.fileName}`);
                                                if (data.notes) proofElements.push(`Notes: ${data.notes}`);

                                                const proof = proofElements.join(' | ');

                                                // Removed confirm to prevent blocking issues
                                                // if (!confirm("Submit this work for review? This cannot be undone.")) return;

                                                setLoading(true);
                                                try {
                                                    const res = await fetch(`${API_URL}/work-permit/${p.id}/submit-work`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ proof, workerId: CURRENT_USER_ID })
                                                    });

                                                    if (!res.ok) {
                                                        const errData = await res.json();
                                                        throw new Error(errData.message || 'Submission failed');
                                                    }

                                                    setSubmissionInputs(prev => {
                                                        const newState = { ...prev };
                                                        delete newState[p.id];
                                                        return newState;
                                                    });
                                                    alert("Work Submitted Successfully! AI is reviewing...");
                                                    fetchPermits();
                                                } catch (e) {
                                                    console.error(e);
                                                    alert(`Error: ${e.message}`);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            style={{
                                                backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                                            }}
                                        >
                                            Submit Work Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Withdrawal Section for COMPLETED permits */}
                        {p.status === 'COMPLETED' && (
                            <div style={{
                                marginTop: '20px',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '8px',
                                border: '1px solid #bbf7d0',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#166534', marginBottom: '4px', marginTop: 0 }}>
                                        🎉 Payment Received!
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#15803d' }}>
                                        You earned <b>{p.currency} {(p.totalAmount - p.adminCommission - p.platformFee).toLocaleString()}</b> on this job.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ ...styles.badgePaid, backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                                        ✅ Added to Balance
                                    </span>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            console.log("Withdrawal Button Clicked");

                                            try {
                                                // 1. Get Live Balance Check (Force fresh fetch)
                                                const balRes = await fetch(`${API_URL}/payment/balance/${CURRENT_USER_ID}?t=${Date.now()}`);
                                                if (!balRes.ok) throw new Error("Failed to fetch wallet balance");
                                                const balData = await balRes.json();
                                                const liveBalance = Number(balData.balance) || 0;

                                                // 2. Calculate Target Amount (from Permit)
                                                const total = Number(p.totalAmount);
                                                const safeCommission = Number(p.adminCommission) || (total * 0.10);
                                                const safeFee = Number(p.platformFee) || (total * 0.05);
                                                const netPermitAmount = total - safeCommission - safeFee;

                                                console.log(`[Withdraw Detail] PermitNet: ${netPermitAmount}, LiveWallet: ${liveBalance}`);

                                                // 3. Determine Withdrawal Amount (Min of Net vs Live)
                                                let amountToWithdraw = netPermitAmount;
                                                let isPartial = false;

                                                if (liveBalance < netPermitAmount) {
                                                    amountToWithdraw = liveBalance;
                                                    isPartial = true;
                                                }

                                                // Precision Fix: Round down to 2 decimals to prevents float errors (e.g. 1275.0000001 > 1275)
                                                amountToWithdraw = Math.floor(amountToWithdraw * 100) / 100;

                                                if (amountToWithdraw <= 0) {
                                                    alert(`❌ Your available wallet balance is $${liveBalance.toFixed(2)}. You cannot withdraw.`);
                                                    return;
                                                }

                                                // 4. Confirm Action
                                                const confirmMsg = isPartial
                                                    ? `⚠️ NOTICE: Your wallet balance ($${liveBalance.toLocaleString()}) is lower than this job's original payout value.\n\nThis will withdraw your ENTIRE available balance of $${amountToWithdraw.toLocaleString()} via Bank Transfer.`
                                                    : `Confirm withdrawal of $${amountToWithdraw.toLocaleString()} via Bank Transfer?`;

                                                if (!confirm(confirmMsg)) return;

                                                // 5. Execute Withdrawal
                                                const res = await fetch(`${API_URL}/payment/withdraw`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        userId: CURRENT_USER_ID,
                                                        amount: amountToWithdraw,
                                                        methodId: 'Bank Transfer (Default)',
                                                        currency: p.currency
                                                    })
                                                });

                                                const text = await res.text();
                                                let data;
                                                try {
                                                    data = JSON.parse(text);
                                                } catch (err) {
                                                    throw new Error(`Server Response: ${text}`);
                                                }

                                                if (res.ok && data.success) {
                                                    alert(`✅ Cashout Success!\n\nRequest ID: ${data.request.id}\nAmount: ${p.currency} ${amountToWithdraw.toLocaleString()}\nStatus: Sent to Admin.`);

                                                    // Refresh Data without reload
                                                    if (onBalanceUpdate) onBalanceUpdate();
                                                    fetchPermits();
                                                } else {
                                                    throw new Error(data.message || "Request failed");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("❌ System Error: " + err.message);
                                            }
                                        }}
                                        style={{
                                            background: '#16a34a',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
                                        }}
                                    >
                                        🏦 Withdraw Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer Status Indicators */}
                        <div style={styles.footer}>
                            {p.status === 'ACTIVE' && (
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Use the form above to submit your deliverables.</span>
                                </div>
                            )}
                            {/* COMPLETED status handled above with withdrawal box */}
                            {p.status === 'PENDING_BUYER_REVIEW' && (
                                <span style={styles.badgeWait}>
                                    ⏳ Proof Submitted - Waiting for Buyer
                                </span>
                            )}
                            {p.status === 'PENDING_AI_CHECK' && (
                                <span style={{ ...styles.badgeWait, backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#d8b4fe' }}>
                                    🤖 AI Validating Proof...
                                </span>
                            )}
                            {p.status === 'PENDING_ADMIN_APPROVAL' && (
                                <span style={{ ...styles.badgeWait, backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                                    🛡️ Under Admin Review
                                </span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkerWorkPermitPanel;
