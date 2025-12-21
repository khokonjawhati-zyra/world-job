
import React, { useState, useEffect } from 'react';

const EmployerTimesheetReview = ({ employerId = '201' }) => {
    // Mock jobs owned by this employer
    const [jobs, setJobs] = useState([
        { id: 'job1', title: 'E-commerce Maintenance' },
        { id: 'job2', title: 'React Component Lib' }
    ]);
    const [selectedJob, setSelectedJob] = useState(jobs[0].id);
    const [logs, setLogs] = useState([]);

    const API_URL = 'http://localhost:3000';

    useEffect(() => {
        if (selectedJob) {
            fetchLogs(selectedJob);
        }
    }, [selectedJob]);

    const fetchLogs = async (jobId) => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/job/${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (e) { console.error(e); }
    };

    const handleApprove = async (logId) => {
        try {
            const res = await fetch(`${API_URL}/time-tracking/approve/${logId}`, {
                method: 'POST'
            });
            if (res.ok) {
                alert('Time Log Approved. Payment Released.');
                fetchLogs(selectedJob);
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Timesheet Approvals</h2>
                <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', background: '#333', color: '#fff', border: '1px solid #555' }}
                >
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th>Worker</th>
                        <th>Duration</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>{new Date(log.startTime).toLocaleDateString()}</td>
                            <td>Worker #{log.workerId}</td>
                            <td>{log.durationMinutes} mins</td>
                            <td style={{ color: 'var(--neon-pink)' }}>${log.totalCost}</td>
                            <td>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                    background: log.status === 'PAID' ? 'green' : log.status === 'PENDING_APPROVAL' ? 'orange' : '#444'
                                }}>
                                    {log.status === 'PENDING_APPROVAL' ? 'NEEDS APPROVAL' : log.status}
                                </span>
                            </td>
                            <td>
                                {log.status === 'PENDING_APPROVAL' && (
                                    <button
                                        onClick={() => handleApprove(log.id)}
                                        className="btn-neon"
                                        style={{ fontSize: '0.8rem', padding: '5px 15px' }}
                                    >
                                        Approve & Pay
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No logs found for this job.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default EmployerTimesheetReview;
