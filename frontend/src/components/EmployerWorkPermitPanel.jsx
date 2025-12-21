import React, { useState, useEffect } from 'react';
import NDAModal from './NDAModal'; // Assuming NDAModal is in a separate file

const EmployerWorkPermitPanel = () => {
    // Mock Current User (Buyer)
    const CURRENT_USER_ID = '201'; // Matches backend seed data
    const API_URL = 'http://localhost:3001';

    const [permits, setPermits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPermit, setEditingPermit] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [showNDAModal, setShowNDAModal] = useState(false);
    const [pendingPermitId, setPendingPermitId] = useState(null);

    useEffect(() => {
        fetchPermits();
    }, []);

    const fetchPermits = async () => {
        try {
            const res = await fetch(`${API_URL}/work-permit/user/BUYER/${CURRENT_USER_ID}`);
            const data = await res.json();
            setPermits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignAndApprove = async (signatureName) => {
        if (!pendingPermitId) return;

        try {
            // 1. Log the signature (Liability Waiver)
            const legalRes = await fetch('http://localhost:3001/investment/nda/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId: pendingPermitId, // Linking to permit ID
                    userId: CURRENT_USER_ID,
                    type: 'WAIVER',
                    signature: signatureName
                })
            });

            if (!legalRes.ok) throw new Error("Legal signature failed");

            // 2. Proceed to Approve Permit
            await handleReview(pendingPermitId, 'APPROVE');

            setShowNDAModal(false);
            setPendingPermitId(null);
        } catch (error) {
            console.error(error);
            alert("Process Failed: " + error.message);
        }
    };

    const initiateApproval = (id) => {
        setPendingPermitId(id);
        setShowNDAModal(true);
    };

    const handleEditSave = async (id, updatedDetails) => {
        try {
            await fetch(`${API_URL}/work-permit/${id}/details`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...updatedDetails, userId: CURRENT_USER_ID })
            });
            setEditingPermit(null);
            fetchPermits();
        } catch (error) {
            alert('Failed to update details');
        }
    };

    const handleReview = async (id, decision) => {
        // if (!confirm(`Confirm ${decision} for this work permit?`)) return; // Removed for better UX
        setProcessingId(id);
        try {
            await fetch(`${API_URL}/work-permit/${id}/buyer-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, userId: CURRENT_USER_ID })
            });

            await fetchPermits();
        } catch (error) {
            console.error('Action failed', error);
            alert('Action failed');
        } finally {
            setProcessingId(null);
        }
    };

    // ... (styles remains same)

    const styles = {
        // ... (keep existing styles)
        container: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontFamily: "'Inter', sans-serif" },
        card: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
        tag: { fontSize: '13px', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', textTransform: 'capitalize' },
        title: { fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', margin: 0 },
        jobId: { fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '4px', margin: 0 },
        jobType: { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' },
        label: { fontSize: '13px', color: '#6b7280', marginBottom: '4px', margin: 0 },
        value: { color: '#111827', fontWeight: '500' },
        warningBox: { marginTop: '16px', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' },
        warningTitle: { fontSize: '12px', color: '#991b1b', fontWeight: '700', marginBottom: '4px', margin: 0 },
        warningText: { fontSize: '14px', color: '#b91c1c', lineHeight: '1.4', margin: 0 },
        financialBox: { backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #f3f4f6' },
        financialLabel: { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px', margin: 0 },
        financialValue: { fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.025em', margin: 0 },
        lockStatus: { fontSize: '13px', color: '#059669', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 },
        aiBox: { borderLeft: '4px solid #3b82f6', paddingLeft: '16px', marginTop: '8px' },
        aiTitle: { fontSize: '12px', color: '#3b82f6', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', margin: 0 },
        meterTrack: { height: '8px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
        actionFooter: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' },
        btnReject: { backgroundColor: '#fff', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' },
        btnApprove: { backgroundColor: '#10b981', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s' },
        btnEdit: { backgroundColor: '#fff', border: '1px solid #d1d5db', color: '#374151', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginRight: 'auto', transition: 'all 0.2s' },
        input: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', outline: 'none' },
        textarea: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', minHeight: '80px', outline: 'none' },
        descriptionBox: { marginTop: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
            case 'PENDING_BUYER_REVIEW': return { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
            case 'PENDING_ADMIN_APPROVAL': return { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
            case 'CANCELLED': return { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5' };
            case 'DISPUTED': return { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
            default: return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
        }
    };

    if (loading) return <div>Loading Work Permits...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Work Permits (Buyer)</h2>
            {permits.length === 0 ? <p style={{ color: '#6b7280', fontSize: '16px' }}>No work permits found.</p> : (
                permits.map(p => (
                    <div key={p.id} style={styles.card}>
                        {editingPermit?.id === p.id ? (
                            <div style={{ width: '100%' }}>
                                <h3 style={{ ...styles.jobId, marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>Edit Permit Details</h3>

                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Title / Project Name</label>
                                <input
                                    style={styles.input}
                                    defaultValue={p.title || ''}
                                    onChange={(e) => setEditingPermit({ ...editingPermit, title: e.target.value })}
                                    placeholder="e.g., AI Model Training Batch A"
                                />

                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Description & Scope of Work</label>
                                <textarea
                                    style={styles.textarea}
                                    defaultValue={p.description || ''}
                                    onChange={(e) => setEditingPermit({ ...editingPermit, description: e.target.value })}
                                    placeholder="Describe the deliverables and timeline..."
                                />

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                                    <button
                                        onClick={() => setEditingPermit(null)}
                                        style={{ ...styles.btnReject, color: '#374151', borderColor: '#d1d5db' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleEditSave(p.id, editingPermit)}
                                        style={styles.btnApprove}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header Section */}
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
                                    {/* Left Column: Worker & System Info */}
                                    <div>
                                        <p style={styles.label}><strong>Worker ID:</strong> <span style={styles.value}>{p.workerId}</span></p>
                                        <p style={styles.label}><strong>Permit ID:</strong> <span style={styles.value}>{p.id}</span></p>
                                        <p style={styles.label}><strong>Created:</strong> <span style={styles.value}>{new Date(p.createdAt).toLocaleDateString()}</span></p>

                                        {p.description && (
                                            <div style={styles.descriptionBox}>
                                                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Scope of Work</p>
                                                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>{p.description}</p>
                                            </div>
                                        )}

                                        {p.status === 'DISPUTED' && (
                                            <div style={styles.warningBox}>
                                                <p style={styles.warningTitle}>DISPUTE REASON PROVIDED</p>
                                                <p style={styles.warningText}>{p.disputeReason || 'No reason provided.'}</p>
                                                {p.aiDisputeSummary && <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', marginTop: '8px', margin: 0 }}>{p.aiDisputeSummary}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Financials & AI */}
                                    <div>
                                        <div style={styles.financialBox}>
                                            <p style={styles.financialLabel}>Escrow Status</p>
                                            <p style={styles.financialValue}>{p.currency} {p.totalAmount.toLocaleString()}</p>
                                            <p style={styles.lockStatus}>{p.escrowLocked ? '🔒 Funds Locked' : '🔓 Funds Unlocked'}</p>
                                        </div>

                                        <div style={styles.aiBox}>
                                            <p style={styles.aiTitle}>AI RISK ANALYSIS</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                                <div style={{ flex: 1, ...styles.meterTrack }}>
                                                    <div style={{ height: '100%', width: `${p.aiRiskScore}%`, backgroundColor: p.aiRiskScore > 50 ? '#ef4444' : '#10b981', borderRadius: '4px' }}></div>
                                                </div>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>{p.aiRiskScore}/100</span>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', lineHeight: '1.4', margin: 0 }}>{p.aiNotes || 'Analysis pending...'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div style={styles.actionFooter}>
                                    {p.status === 'PENDING_BUYER_REVIEW' && (
                                        <>
                                            <button
                                                onClick={() => setEditingPermit({ ...p })}
                                                style={styles.btnEdit}
                                                disabled={processingId === p.id}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                                            >
                                                ✏️ Edit Details
                                            </button>

                                            <button
                                                onClick={() => handleReview(p.id, 'REJECT')}
                                                style={{ ...styles.btnReject, opacity: processingId === p.id ? 0.7 : 1 }}
                                                disabled={processingId === p.id}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                                            >
                                                {processingId === p.id ? 'Processing...' : 'Reject & Unlock'}
                                            </button>
                                            <button
                                                onClick={() => initiateApproval(p.id)}
                                                style={{ ...styles.btnApprove, opacity: processingId === p.id ? 0.7 : 1 }}
                                                disabled={processingId === p.id}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                            >
                                                {processingId === p.id ? 'Processing...' : 'Sign Waiver & Approve'}
                                            </button>
                                        </>
                                    )}
                                    {p.status === 'PENDING_AI_CHECK' && (
                                        <div style={{ width: '100%', textAlign: 'right' }}>
                                            <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #d8b4fe' }}>
                                                ● AI Validating...
                                            </span>
                                        </div>
                                    )}
                                    {p.status === 'ACTIVE' && (
                                        <div style={{ width: '100%', textAlign: 'right' }}>
                                            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                                                ● Active & Authorized
                                            </span>
                                        </div>
                                    )}
                                    {p.status === 'CANCELLED' && (
                                        <div style={{ width: '100%', textAlign: 'right' }}>
                                            <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #fca5a5' }}>
                                                ● Cancelled & Refunded
                                            </span>
                                        </div>
                                    )}
                                    {p.status === 'PENDING_ADMIN_APPROVAL' && (
                                        <div style={{ width: '100%', textAlign: 'right' }}>
                                            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #bfdbfe' }}>
                                                ● Waiting for Admin
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}

            <NDAModal
                isOpen={showNDAModal}
                onClose={() => setShowNDAModal(false)}
                onSign={handleSignAndApprove}
                userId={CURRENT_USER_ID}
                type="WAIVER"
                projectTitle={permits.find(p => p.id === pendingPermitId)?.title || 'Work Permit'}
            />
        </div>
    );
};

export default EmployerWorkPermitPanel;
