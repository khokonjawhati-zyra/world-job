import React, { useState, useEffect } from 'react';

const TimeTracker = ({ workerId = '101' }) => {
    const [activeJob, setActiveJob] = useState(null);
    const [timer, setTimer] = useState(0);
    const [logs, setLogs] = useState([]);
    const [jobs] = useState([
        { id: 'job1', title: 'E-commerce Maintenance', rate: 50 },
        { id: 'job2', title: 'React Component Lib', rate: 65 }
    ]);
    const [intervalId, setIntervalId] = useState(null);

    // Initial load: Check for active timer from backend
    useEffect(() => {
        fetch(`http://localhost:3000/time-tracking/active/${workerId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.status === 'ACTIVE') {
                    const active = jobs.find(j => j.id === data.jobId);
                    if (active) {
                        setActiveJob(active);
                        const start = new Date(data.startTime).getTime();
                        const now = new Date().getTime();
                        setTimer(Math.floor((now - start) / 1000));
                        startLocalTimer();
                    }
                }
            })
            .catch(err => console.error("Error fetching active timer:", err));

        fetchLogs();
    }, [workerId]);

    const fetchLogs = () => {
        fetch(`http://localhost:3000/time-tracking/worker/${workerId}`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(console.error);
    };

    const startLocalTimer = () => {
        if (intervalId) clearInterval(intervalId);
        const id = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        setIntervalId(id);
    };

    const handleStart = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;

        fetch('http://localhost:3000/time-tracking/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId, workerId, hourlyRate: job.rate })
        })
            .then(res => res.json())
            .then(() => {
                setActiveJob(job);
                setTimer(0);
                startLocalTimer();
            })
            .catch(console.error);
    };

    const handleStop = () => {
        fetch('http://localhost:3000/time-tracking/stop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId })
        })
            .then(res => res.json())
            .then(() => {
                setActiveJob(null);
                clearInterval(intervalId);
                setIntervalId(null);
                setTimer(0);
                fetchLogs();
                alert('Time logged and sent for approval!');
            })
            .catch(console.error);
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Time Tracker</h2>

            {/* Active Timer Section */}
            <div style={{ padding: '30px', background: activeJob ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: activeJob ? '1px solid var(--neon-lime)' : '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '40px' }}>
                {activeJob ? (
                    <>
                        <h3 style={{ color: 'var(--neon-lime)', marginBottom: '10px' }}>Creating Magic for: {activeJob.title}</h3>
                        <div style={{ fontSize: '4rem', fontFamily: 'monospace', fontWeight: 'bold', margin: '20px 0', color: '#fff' }}>
                            {formatTime(timer)}
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>Rate: ${activeJob.rate}/hr — Est. Earnings: ${((timer / 3600) * activeJob.rate).toFixed(2)}</p>
                        <button className="btn-neon" style={{ marginTop: '20px', borderColor: 'red', color: 'red', fontSize: '1.2rem', padding: '10px 40px' }} onClick={handleStop}>
                            STOP TIMER
                        </button>
                    </>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '20px' }}>Select a Job to Start Tracking</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {jobs.map(job => (
                                <button key={job.id} onClick={() => handleStart(job.id)} className="btn-neon" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span>{job.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${job.rate}/hr</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', marginTop: '5px' }}>START TRACKING &rarr;</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Logs History */}
            <h3>Work Log History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th>Job ID</th>
                        <th>Duration</th>
                        <th>Earnings</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>{new Date(log.startTime).toLocaleDateString()}</td>
                            <td>{log.jobId}</td>
                            <td>{log.durationMinutes} mins</td>
                            <td style={{ color: 'var(--neon-green)' }}>${log.totalCost}</td>
                            <td>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                    background: log.status === 'PAID' ? 'rgba(0,255,0,0.2)' : 'rgba(255,165,0,0.2)',
                                    color: log.status === 'PAID' ? 'var(--neon-lime)' : 'orange'
                                }}>
                                    {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No logs found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TimeTracker;
