
import React, { useState, useEffect } from 'react';

const DailyLaborMarketplace = ({ userId, role }) => {
    // role: 'employer' or 'worker'
    const [view, setView] = useState('market'); // 'market', 'my-jobs', 'post'
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [view]);

    const fetchJobs = () => {
        setLoading(true);
        let url = 'http://localhost:3001/labor/jobs';
        if (role === 'employer' && view === 'my-jobs') {
            url = `http://localhost:3001/labor/jobs/employer/${userId}`;
        }

        fetch(url)
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

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🚧 Offline & Daily Labor Market
                    <span style={{ fontSize: '0.8rem', background: 'var(--neon-cyan)', color: '#000', padding: '2px 8px', borderRadius: '10px' }}>{role.toUpperCase()}</span>
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {role === 'employer' && (
                        <button
                            onClick={() => setView('post')}
                            className="btn-neon"
                            style={{ opacity: view === 'post' ? 1 : 0.7 }}
                        >
                            + Post Daily Job
                        </button>
                    )}
                    <button
                        onClick={() => setView('market')}
                        style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Marketplace
                    </button>
                    <button
                        onClick={() => setView('my-jobs')}
                        style={{ background: 'transparent', border: '1px solid var(--neon-lime)', color: 'var(--neon-lime)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        My Activity
                    </button>
                </div>
            </div>

            {view === 'post' && role === 'employer' ? (
                <PostJobForm userId={userId} onSuccess={() => setView('my-jobs')} />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {loading ? <p>Loading jobs...</p> : jobs.map(job => (
                        <JobCard key={job.id} job={job} role={role} userId={userId} refresh={fetchJobs} />
                    ))}
                    {!loading && jobs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No jobs found.</p>}
                </div>
            )}
        </div>
    );
};

const PostJobForm = ({ userId, onSuccess }) => {
    const [form, setForm] = useState({
        title: '',
        category: 'construction',
        date: '',
        shiftStart: '09:00',
        shiftEnd: '17:00',
        vacancies: 1,
        wage: '',
        location: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/labor/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employerId: userId, data: form })
        })
            .then(res => res.json())
            .then(() => {
                alert('Job Posted Successfully!');
                onSuccess();
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
            <h3>Create Daily Labor Shift</h3>
            <input required placeholder="Job Title (e.g. Construction Helper)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px' }}>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                    <option value="construction" style={{ backgroundColor: '#000' }}>Construction</option>
                    <option value="events" style={{ backgroundColor: '#000' }}>Events / Catering</option>
                    <option value="cleaning" style={{ backgroundColor: '#000' }}>Cleaning</option>
                    <option value="factory" style={{ backgroundColor: '#000' }}>Factory / Warehouse</option>
                    <option value="other" style={{ backgroundColor: '#000' }}>Other</option>
                </select>
                <input required type="number" placeholder="Workers Needed" value={form.vacancies} onChange={e => setForm({ ...form, vacancies: parseInt(e.target.value) })} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                <input required type="time" value={form.shiftStart} onChange={e => setForm({ ...form, shiftStart: e.target.value })} style={inputStyle} />
                <input required type="time" value={form.shiftEnd} onChange={e => setForm({ ...form, shiftEnd: e.target.value })} style={inputStyle} />
            </div>
            <input required type="number" placeholder="Daily Wage ($)" value={form.wage} onChange={e => setForm({ ...form, wage: parseFloat(e.target.value) })} style={inputStyle} />
            <input required placeholder="Location Address" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
            <textarea required placeholder="Job Details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
            <button type="submit" className="btn-neon">Post Job</button>
        </form>
    );
};

const JobCard = ({ job, role, userId, refresh }) => {
    const isApplied = job.applicants.includes(userId);
    const isHired = job.hiredWorkers.includes(userId);
    const isOwner = job.employerId === userId;

    // Simple logic to disable apply if full
    const isFull = job.hiredCount >= job.vacancies;

    const handleApply = () => {
        fetch(`http://localhost:3001/labor/jobs/${job.id}/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId: userId })
        }).then(() => { alert('Applied!'); refresh(); });
    };

    const handleHire = (applicantId) => {
        fetch(`http://localhost:3001/labor/jobs/${job.id}/hire`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId: applicantId })
        }).then(() => { alert('Worker Hired!'); refresh(); });
    };

    return (
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', border: isHired ? '1px solid var(--neon-lime)' : '1px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>{job.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--neon-green)' }}>${job.wage}/day</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{job.category.toUpperCase()} • {job.location}</p>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                <span>📅 {new Date(job.date).toLocaleDateString()}</span>
                <span>⏰ {job.shiftStart} - {job.shiftEnd}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}>
                Positions: {job.hiredCount} / {job.vacancies} Filled
            </div>

            {/* Actions for Worker */}
            {role === 'worker' && (
                <>
                    {isHired ? (
                        <AttendanceView jobId={job.id} workerId={userId} refresh={refresh} />
                    ) : (
                        <button
                            disabled={isApplied || isFull}
                            onClick={handleApply}
                            className={isApplied ? '' : 'btn-neon'}
                            style={{
                                width: '100%',
                                background: isApplied ? 'grey' : 'var(--neon-cyan)',
                                cursor: isApplied || isFull ? 'default' : 'pointer'
                            }}
                        >
                            {isApplied ? 'Application Pending' : isFull ? 'Positions Full' : 'Apply Now'}
                        </button>
                    )}
                </>
            )}

            {/* Actions for Employer */}
            {isOwner && (
                <div style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                    <strong>Applicants ({job.applicants.length})</strong>
                    {job.applicants.map(appId => (
                        <div key={appId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', fontSize: '0.9rem' }}>
                            <span>User #{appId.substr(0, 4)}...</span>
                            {!job.hiredWorkers.includes(appId) && job.hiredCount < job.vacancies && (
                                <button onClick={() => handleHire(appId)} style={{ padding: '2px 8px', background: 'var(--neon-lime)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hire</button>
                            )}
                            {job.hiredWorkers.includes(appId) && <span style={{ color: 'var(--neon-green)' }}>Hired</span>}
                        </div>
                    ))}
                    {job.hiredWorkers.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Hired Staff</strong>
                            {job.hiredWorkers.map(wId => (
                                <div key={wId} style={{ marginTop: '5px' }}>
                                    <AttendanceControl employerId={userId} jobId={job.id} workerId={wId} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AttendanceView = ({ jobId, workerId }) => {
    const [record, setRecord] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/labor/attendance/${jobId}`)
            .then(res => res.json())
            .then(data => {
                const myRecord = data.find(r => r.workerId === workerId);
                setRecord(myRecord);
            });
    }, [jobId]);

    const handleCheckIn = () => {
        fetch(`http://localhost:3001/labor/attendance/${jobId}/check-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId })
        }).then(() => alert('Checked In!'));
    };

    const handleCheckOut = () => {
        const proofs = [prompt("Enter proof URL (optional):")];
        fetch(`http://localhost:3001/labor/attendance/${jobId}/check-out`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId, proofs })
        }).then(() => alert('Checked Out! Work Submitted.'));
    };

    if (!record) return <small>Loading status...</small>;

    return (
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Status: <strong style={{ color: 'var(--neon-cyan)' }}>{record.status.toUpperCase()}</strong></span>
            </div>
            {record.status === 'pending' && <button onClick={handleCheckIn} style={actionBtnStyle}>📍 Check In</button>}
            {record.status === 'checked-in' && <button onClick={handleCheckOut} style={{ ...actionBtnStyle, background: 'var(--neon-pink)', color: '#fff' }}>📤 Check Out & Submit Proof</button>}
            {record.status === 'checked-out' && <small style={{ color: 'orange' }}>Waiting for Approval...</small>}
            {record.status === 'paid' && <small style={{ color: 'var(--neon-green)' }}>✅ Payment Received</small>}
        </div>
    );
};

const AttendanceControl = ({ jobId, workerId }) => {
    const [record, setRecord] = useState(null);

    const refresh = () => {
        fetch(`http://localhost:3001/labor/attendance/${jobId}`)
            .then(res => res.json())
            .then(data => {
                const myRecord = data.find(r => r.workerId === workerId);
                setRecord(myRecord);
            });
    };

    useEffect(() => { refresh(); }, []);

    const handleApprove = () => {
        fetch(`http://localhost:3001/labor/attendance/${jobId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId })
        }).then(() => { alert('Approved & Paid!'); refresh(); });
    };

    if (!record) return null;

    return (
        <div style={{ padding: '5px', background: 'rgba(0,0,0,0.2)', borderLeft: '2px solid #fff', marginBottom: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>Worker #{workerId.substr(0, 4)}</span>
                <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{record.status}</span>
            </div>
            {record.status === 'checked-out' && (
                <button onClick={handleApprove} style={{ marginTop: '5px', width: '100%', padding: '4px', background: 'var(--neon-green)', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Approve Payment
                </button>
            )}
        </div>
    );
};

const inputStyle = {
    padding: '12px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #444',
    color: '#fff',
    borderRadius: '5px',
    width: '100%',
    fontFamily: 'inherit'
};

const actionBtnStyle = {
    width: '100%',
    padding: '8px',
    background: 'var(--neon-lime)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default DailyLaborMarketplace;
