
import React, { useState, useEffect } from 'react';

const AdminVerificationPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        setLoading(true);
        fetch('http://localhost:3001/verification/pending')
            .then(res => res.json())
            .then(data => {
                setRequests(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = (id, action) => {
        fetch(`http://localhost:3001/verification/${action}/${id}`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                alert(`Request ${action}ed`);
                fetchRequests();
            })
            .catch(console.error);
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Verification Requests</h2>
                <button onClick={fetchRequests} className="btn-neon" style={{ fontSize: '0.9rem' }}>Refresh</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>User ID</th>
                            <th>Role</th>
                            <th>Type</th>
                            <th>Data/Document</th>
                            <th>Submitted At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No pending requests.</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{req.userId}</td>
                                    <td>{req.userType}</td>
                                    <td><span style={{ color: 'var(--neon-cyan)' }}>{req.type}</span></td>
                                    <td>
                                        {req.type === 'IDENTITY' ? (
                                            <a href={req.data} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-pink)' }}>View Document</a>
                                        ) : (
                                            req.data
                                        )}
                                    </td>
                                    <td>{new Date(req.submittedAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleAction(req.id, 'approve')}
                                                className="btn-neon"
                                                style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'rgba(0,255,0,0.1)', borderColor: 'var(--neon-lime)', color: 'var(--neon-lime)' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'reject')}
                                                className="btn-neon"
                                                style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', borderColor: 'red', color: 'red' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminVerificationPanel;
