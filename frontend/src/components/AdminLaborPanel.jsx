
import React, { useState, useEffect } from 'react';

const AdminLaborPanel = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        setLoading(true);
        fetch('https://world-job-backend.vercel.app/labor/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const viewJobDetails = (job) => {
        setSelectedJob(job);
        // Fetch specific attendance for this job
        fetch(`https://world-job-backend.vercel.app/labor/attendance/${job.id}`)
            .then(res => res.json())
            .then(data => setAttendance(data));
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Offline Labor Oversight</h2>
                <button onClick={fetchJobs} className="btn-neon">Refresh Market</button>
            </div>

            {loading ? <p>Loading Labor Data...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '30px' }}>

                    {/* Job List */}
                    <div>
                        <h3>Active Daily Jobs ({jobs.length})</h3>
                        <div style={{ maxHeight: '600px', overflowY: 'auto', marginTop: '15px', display: 'grid', gap: '10px' }}>
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => viewJobDetails(job)}
                                    style={{
                                        padding: '15px',
                                        background: selectedJob?.id === job.id ? 'rgba(0,255,100,0.1)' : 'rgba(255,255,255,0.05)',
                                        border: selectedJob?.id === job.id ? '1px solid var(--neon-lime)' : '1px solid transparent',
                                        borderRadius: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong style={{ color: '#fff' }}>{job.title}</strong>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(job.date).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '5px 0' }}>Employer: {job.employerId}</p>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                                        <span style={{ color: job.status === 'open' ? 'var(--neon-cyan)' : 'orange' }}>{job.status.toUpperCase()}</span>
                                        <span>vacancies: {job.hiredCount}/{job.vacancies}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Detail & Attendance View */}
                    {selectedJob && (
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <h3>{selectedJob.title}</h3>
                                <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <p><strong>Location:</strong> {selectedJob.location}</p>
                                <p><strong>Category:</strong> {selectedJob.category}</p>
                                <p><strong>Wage:</strong> ${selectedJob.wage}/day</p>
                                <p><strong>Shift:</strong> {selectedJob.shiftStart} - {selectedJob.shiftEnd}</p>
                                <p><strong>Desc:</strong> {selectedJob.description}</p>
                            </div>

                            <h4>Hired Workers & Attendance</h4>
                            {selectedJob.hiredWorkers.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No workers hired yet.</p>
                            ) : (
                                <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
                                    {selectedJob.hiredWorkers.map(workerId => {
                                        const record = attendance.find(r => r.workerId === workerId);
                                        return (
                                            <div key={workerId} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Worker: {workerId}</span>
                                                    <span style={{
                                                        color: record?.status === 'paid' ? 'var(--neon-green)' :
                                                            record?.status === 'checked-in' ? 'var(--neon-cyan)' :
                                                                record?.status === 'checked-out' ? 'orange' : '#fff'
                                                    }}>
                                                        {record ? record.status.toUpperCase() : 'PENDING'}
                                                    </span>
                                                </div>
                                                {record?.checkInTime && <div style={{ fontSize: '0.8rem', color: '#aaa' }}>In: {new Date(record.checkInTime).toLocaleTimeString()}</div>}
                                                {record?.checkOutTime && <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Out: {new Date(record.checkOutTime).toLocaleTimeString()}</div>}
                                                {record?.proofMedia?.length > 0 && (
                                                    <div style={{ marginTop: '5px' }}>
                                                        <a href={record.proofMedia[0]} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-pink)', fontSize: '0.8rem' }}>View Proof Evidence</a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminLaborPanel;
