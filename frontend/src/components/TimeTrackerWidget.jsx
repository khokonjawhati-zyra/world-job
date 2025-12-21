
import React, { useState, useEffect } from 'react';

const TimeTrackerWidget = ({ jobId = 'job-123', workerId = '101', hourlyRate = 25 }) => {
    const [timer, setTimer] = useState(null); // { id, startTime }
    const [duration, setDuration] = useState(0); // seconds
    const [logs, setLogs] = useState([]);
    const [elapsed, setElapsed] = useState('00:00:00');

    const API_URL = 'http://localhost:3000';

    useEffect(() => {
        fetchActiveTimer();
        fetchLogs();
    }, [jobId]);

    useEffect(() => {
        let interval;
        if (timer) {
            interval = setInterval(() => {
                const start = new Date(timer.startTime).getTime();
                const now = new Date().getTime();
                const diff = Math.floor((now - start) / 1000);
                setDuration(diff);
                setElapsed(formatTime(diff));
            }, 1000);
        } else {
            setElapsed('00:00:00');
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const fetchActiveTimer = async () => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/active/${workerId}`);
            if (res.ok) {
                const data = await res.json();
                if (data) setTimer(data);
            }
        } catch (e) {
            console.error("Failed to fetch active timer", e);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/worker/${workerId}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleStart = async () => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, workerId, hourlyRate })
            });
            if (res.ok) {
                const data = await res.json();
                setTimer(data);
            } else {
                alert('Failed to start timer. You may already have one active.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleStop = async () => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/stop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workerId })
            });
            if (res.ok) {
                setTimer(null);
                fetchLogs(); // Refresh log list
                alert('Timer Stopped. Log submitted for approval.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 className="text-xl font-bold text-white">⏱️ Time Tracker (Job #{jobId})</h3>
                <div style={{ fontSize: '2rem', fontFamily: 'monospace', color: timer ? 'var(--neon-lime)' : '#666' }}>
                    {elapsed}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                {!timer ? (
                    <button
                        onClick={handleStart}
                        className="btn-neon"
                        style={{ background: 'rgba(0,255,0,0.2)', width: '100%' }}
                    >
                        START TIMER
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        className="btn-neon"
                        style={{ background: 'rgba(255,0,0,0.2)', borderColor: 'red', color: 'red', width: '100%' }}
                    >
                        STOP TIMER
                    </button>
                )}
            </div>

            <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Recent Logs</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.9rem', color: '#ccc' }}>
                    <thead>
                        <tr style={{ textAlign: 'left' }}>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Earned</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '8px 0' }}>{new Date(log.startTime).toLocaleDateString()}</td>
                                <td>{log.durationMinutes ? `${log.durationMinutes}m` : 'Running...'}</td>
                                <td style={{ color: 'var(--neon-green)' }}>
                                    {log.totalCost ? `$${log.totalCost}` : '-'}
                                </td>
                                <td>
                                    <span style={{
                                        padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem',
                                        background: log.status === 'PAID' ? 'green' : '#444'
                                    }}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeTrackerWidget;
