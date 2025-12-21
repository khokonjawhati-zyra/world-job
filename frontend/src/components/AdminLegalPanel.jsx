import React, { useState, useEffect } from 'react';

const AdminLegalPanel = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [terms, setTerms] = useState({ clauses: [], version: 0 });
    const [newClause, setNewClause] = useState('');

    useEffect(() => {
        // Fetch Audit Logs
        fetch('https://world-job-backend.vercel.app/investment/admin/nda-audit')
            .then(res => res.json())
            .then(setAuditLogs)
            .catch(err => {
                console.error("Failed to fetch NDA logs", err);
            });

        // Fetch Terms
        fetchTerms();
        setLoading(false);
    }, []);

    const fetchTerms = () => {
        fetch('https://world-job-backend.vercel.app/legal/terms')
            .then(res => res.json())
            .then(setTerms)
            .catch(console.error);
    };

    const handleAddClause = () => {
        if (!newClause.trim()) return;
        fetch('https://world-job-backend.vercel.app/legal/clause', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newClause })
        })
            .then(res => res.json())
            .then(data => {
                setTerms(data);
                setNewClause('');
            });
    };

    const handleRemoveClause = (id) => {
        if (!window.confirm('Delete this clause?')) return;
        fetch(`https://world-job-backend.vercel.app/legal/clause/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(setTerms)
            .catch(err => alert('Cannot remove mandatory clause'));
    };

    const exportLogs = () => {
        const headers = ["Signature ID", "Date", "Investor ID", "Project ID"];
        const rows = auditLogs.map(l => [l.signatureId, new Date(l.timestamp).toISOString(), l.userId, l.proposalId]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nda_audit_trail_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="glass-panel" style={{ padding: '30px' }}>Loading Legal Audit Vault...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Dynamic T&C Manager */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid var(--neon-magenta)' }}>
                <h2 style={{ color: 'var(--neon-magenta)' }}>📜 Dynamic Terms & Conditions Manager</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ color: '#ccc' }}>Current Version: v{terms.version}.0</p>
                    <small style={{ color: '#888' }}>Updates apply instantly to new registrations.</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {terms.clauses.map((clause, idx) => (
                        <div key={clause.id} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '15px',
                            borderRadius: '10px',
                            borderLeft: clause.isMandatory ? '4px solid red' : '4px solid var(--neon-cyan)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                {clause.isMandatory && <span style={{ color: 'red', fontSize: '0.7em', textTransform: 'uppercase', fontWeight: 'bold' }}>Mandatory Integrity Clause</span>}
                                <p style={{ color: '#fff', marginTop: '5px' }}>{idx + 1}. {clause.content}</p>
                                <small style={{ color: '#666' }}>Added: {new Date(clause.createdAt).toLocaleDateString()}</small>
                            </div>
                            {!clause.isMandatory && (
                                <button onClick={() => handleRemoveClause(clause.id)} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}>
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Add new legal clause..."
                        value={newClause}
                        onChange={e => setNewClause(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                    />
                    <button onClick={handleAddClause} className="btn-neon">Add Clause (+)</button>
                </div>
            </div>

            {/* Existing Audit Logs */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid cyan' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: 'cyan' }}>🛡️ Legal Audit Vault (NDAs)</h2>
                    <button onClick={exportLogs} className="btn-neon">Export CSV</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Signature ID</th>
                            <th>Type</th>
                            <th>Timestamp</th>
                            <th>User ID</th>
                            <th>Project ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No active agreements found.</td></tr>
                        ) : (
                            auditLogs.map((log, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px', fontFamily: 'monospace', color: 'cyan' }}>{log.signatureId}</td>
                                    <td><span style={{ color: 'cyan' }}>NDA</span></td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.userId}</td>
                                    <td>{log.proposalId?.substring(0, 8)}...</td>
                                    <td><span style={{ color: '#0f0' }}>VALID</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLegalPanel;
