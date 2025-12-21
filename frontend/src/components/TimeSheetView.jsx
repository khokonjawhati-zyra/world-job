import React, { useState, useEffect } from 'react';

const TimeSheetView = ({ jobId = 'job1' }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch logs for the specific job or all managed jobs (mocking job1 here)
        fetch(`http://localhost:3000/time-tracking/job/${jobId}`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(console.error);
    }, [jobId]);

    const handleApprove = (logId) => {
        fetch(`http://localhost:3000/time-tracking/approve/${logId}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(() => {
                alert('Log approved and payment processed from Escrow');
                // Refresh logs
                fetch(`http://localhost:3000/time-tracking/job/${jobId}`)
                    .then(res => res.json())
                    .then(data => setLogs(data));
            })
            .catch(console.error);
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h2>Hourly Worker Time Sheets</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Review and approve time logs for automatic payouts.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th>Worker</th>
                        <th>Duration</th>
                        <th>Rate</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>{new Date(log.startTime).toLocaleDateString()}</td>
                            <td>{log.workerId}</td>
                            <td>{log.durationMinutes ? `${log.durationMinutes}m` : 'Active'}</td>
                            <td>${log.hourlyRate}/hr</td>
                            <td style={{ color: 'var(--neon-green)' }}>${log.totalCost || '---'}</td>
                            <td>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                    background: log.status === 'PAID' ? 'rgba(0,255,0,0.2)' :
                                        log.status === 'ACTIVE' ? 'rgba(0,200,255,0.2)' : 'rgba(255,165,0,0.2)',
                                    color: log.status === 'PAID' ? 'var(--neon-lime)' :
                                        log.status === 'ACTIVE' ? 'var(--neon-cyan)' : 'orange'
                                }}>
                                    {log.status}
                                </span>
                            </td>
                            <td>
                                {log.status === 'PENDING_APPROVAL' && (
                                    <button
                                        className="btn-neon"
                                        onClick={() => handleApprove(log.id)}
                                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                    >
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No time logs found for this project.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TimeSheetView;
