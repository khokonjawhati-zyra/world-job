
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WorkerRequestsFeed = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/worker-requests')
            .then(res => res.json())
            .then(data => {
                // Filter only OPEN requests
                const openRequests = data.filter(r => r.status === 'OPEN');
                setRequests(openRequests);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#fff' }}>Worker Job Requests</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Browse job requests posted effectively by workers. Reach out if their skills match your needs.
            </p>

            {loading ? <p>Loading requests...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {requests.map(req => (
                        <div key={req.id} className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'var(--neon-pink)' }}></div>

                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{req.title}</h3>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>Posted by Worker #{req.workerId}</span>
                                    <span>•</span>
                                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {req.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {req.skills.map(skill => (
                                    <span key={skill} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>
                                    ${req.preferredRate}/hr
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link to={`/profile/worker/${req.workerId}`} className="btn-neon" style={{ fontSize: '0.8rem', padding: '8px 15px', textDecoration: 'none', display: 'inline-block' }}>
                                        View Profile
                                    </Link>
                                    <button className="btn-neon" style={{ fontSize: '0.8rem', padding: '8px 15px', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No active worker requests found.</p>}
                </div>
            )}
        </div>
    );
};

export default WorkerRequestsFeed;
