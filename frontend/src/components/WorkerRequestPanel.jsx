
import React, { useState, useEffect } from 'react';

const WorkerRequestPanel = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReq, setNewReq] = useState({ title: '', description: '', preferredRate: '', skills: '' });
    const workerId = '101'; // Mock ID

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        fetch(`http://localhost:3000/worker-requests/worker/${workerId}`)
            .then(res => res.json())
            .then(data => {
                setMyRequests(data);
                setLoading(false);
            })
            .catch(err => {
                console.warn("Fetch Failed (Demo Mode):", err);
                // Mock Fallback
                setMyRequests([
                    {
                        id: 'mock-req-1',
                        title: 'Need React Project (Demo)',
                        description: 'Looking for short term frontend work. I am available immediately.',
                        preferredRate: 25,
                        skills: ['React', 'CSS'],
                        status: 'OPEN'
                    }
                ]);
                setLoading(false);
            });
    };

    const handleCreate = () => {
        if (!newReq.title || !newReq.description) return alert("Title and Description Required");

        fetch('http://localhost:3000/worker-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workerId,
                title: newReq.title,
                description: newReq.description,
                preferredRate: parseFloat(newReq.preferredRate) || 0,
                skills: newReq.skills.split(',').map(s => s.trim())
            })
        })
            .then(res => res.json())
            .then(() => {
                alert("Job Request Posted!");
                setNewReq({ title: '', description: '', preferredRate: '', skills: '' });
                fetchRequests();
            })
            .catch(err => {
                console.warn("Post Failed (Demo Mode):", err);
                // Mock Success
                alert("Job Request Posted! (Demo Mode)");
                const mockReq = {
                    id: 'mock-' + Date.now(),
                    ...newReq,
                    preferredRate: parseFloat(newReq.preferredRate) || 0,
                    skills: newReq.skills.split(',').map(s => s.trim()),
                    status: 'OPEN'
                };
                setMyRequests(prev => [mockReq, ...prev]);
                setNewReq({ title: '', description: '', preferredRate: '', skills: '' });
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#fff' }}>My Job Requests (Reverse Post)</h2>
            <p style={{ color: 'var(--text-muted)' }}>Post what kind of job you are looking for so Employers can find you.</p>

            <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', display: 'grid', gap: '15px' }}>
                <input
                    placeholder="Short Title (e.g. Need Remote React Project)"
                    value={newReq.title}
                    onChange={e => setNewReq({ ...newReq, title: e.target.value })}
                    style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                />
                <textarea
                    placeholder="Describe what you are looking for..."
                    value={newReq.description}
                    onChange={e => setNewReq({ ...newReq, description: e.target.value })}
                    style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px', minHeight: '80px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                        type="number"
                        placeholder="Preferred Hourly Rate ($)"
                        value={newReq.preferredRate}
                        onChange={e => setNewReq({ ...newReq, preferredRate: e.target.value })}
                        style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                    />
                    <input
                        placeholder="Skills (comma separated)"
                        value={newReq.skills}
                        onChange={e => setNewReq({ ...newReq, skills: e.target.value })}
                        style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                    />
                </div>
                <button onClick={handleCreate} className="btn-neon" style={{ justifySelf: 'start' }}>Post Request</button>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>Active Requests</h3>
                {loading ? <p>Loading...</p> : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {myRequests.map(req => (
                            <div key={req.id} className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--neon-cyan)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ margin: 0 }}>{req.title}</h4>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: '5px', fontSize: '0.8rem',
                                        background: req.status === 'OPEN' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                                        color: req.status === 'OPEN' ? 'var(--neon-green)' : 'red'
                                    }}>
                                        {req.status}
                                    </span>
                                </div>
                                <p style={{ color: '#ccc', fontSize: '0.9rem', margin: '10px 0' }}>{req.description}</p>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>${req.preferredRate}/hr</span>
                                    <span>•</span>
                                    <span>{req.skills.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                        {myRequests.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No active requests.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerRequestPanel;
