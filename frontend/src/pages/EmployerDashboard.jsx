import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ReviewModal from '../components/ReviewModal';
import DisputeForm from '../components/DisputeForm';
import SupportTicketForm from '../components/SupportTicketForm';
import TimeSheetView from '../components/TimeSheetView';
import WorkerRequestsFeed from '../components/WorkerRequestsFeed';
import InvestorPortalView from '../components/InvestorPortalView';
import VerificationWidget from '../components/VerificationWidget';
import FinancialsPanel from '../components/FinancialsPanel';
import DailyLaborMarketplace from '../components/DailyLaborMarketplace';
import GovernmentEnterprisePortal from '../components/GovernmentEnterprisePortal';
import EmployerEmergencyPanel from '../components/EmployerEmergencyPanel';
import EmployerWorkPermitPanel from '../components/EmployerWorkPermitPanel';
import JobPostTemplate from '../components/JobPostTemplate';
import ReferralDashboard from '../components/ReferralDashboard';
import ApplicantSelectionModal from '../components/ApplicantSelectionModal';
import UniversalChat from '../components/UniversalChat';
import SecuritySettings from '../components/SecuritySettings';
import Footer from '../components/Footer';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationBanner from '../components/NotificationBanner';
import NotificationBell from '../components/NotificationBell';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', textAlign: 'center', marginTop: '50px' }}>
                    <h1>⚠️ Something went wrong in Employer Dashboard.</h1>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>Reload Page</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Helper Component for Employer Milestone Management
const EmployerMilestoneView = ({ projectId }) => {
    const [milestones, setMilestones] = React.useState([]);
    const [projectValue, setProjectValue] = React.useState(0);
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [newMilestone, setNewMilestone] = React.useState({ description: '', amount: '' });

    const fetchMilestones = () => {
        fetch('https://world-job-backend.vercel.app/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const project = data.find(p => p.id === projectId);
                    if (project) {
                        setMilestones(project.milestones || []);
                        setProjectValue(Number(project.salaryMax) || 0);
                    }
                }
            })
            .catch(console.error);
    };

    React.useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const handleApprove = (mId) => {
        if (!window.confirm("Approve this milestone? Funds will be released to the worker.")) return;

        fetch(`https://world-job-backend.vercel.app/projects/${projectId}/milestones/${mId}/approve`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                alert('Milestone Approved & Paid!');
                fetchMilestones();
            })
            .catch(err => alert('Error: ' + err.message));
    };

    const handleAddMilestone = () => {
        if (!newMilestone.description || !newMilestone.amount) return;

        fetch(`https://world-job-backend.vercel.app/projects/${projectId}/milestones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: newMilestone.description,
                amount: Number(newMilestone.amount)
            })
        })
            .then(res => res.json())
            .then(() => {
                setNewMilestone({ description: '', amount: '' });
                setShowAddForm(false);
                fetchMilestones();
            })
            .catch(err => alert("Failed to add milestone: " + err.message));
    };

    // Calculate Progress
    const totalMilestoneValue = milestones.reduce((sum, m) => sum + Number(m.amount), 0);
    const paidValue = milestones.filter(m => m.status === 'paid').reduce((sum, m) => sum + Number(m.amount), 0);
    const progressPercent = totalMilestoneValue > 0 ? (paidValue / totalMilestoneValue) * 100 : 0;

    return (
        <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <small style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Milestones & Progress</small>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Add Milestone"
                >
                    +
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginBottom: '15px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--neon-lime)', transition: 'width 0.5s' }}></div>
            </div>

            {showAddForm && (
                <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            placeholder="Desc"
                            value={newMilestone.description}
                            onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })}
                            style={{ flex: 2, padding: '8px', borderRadius: '4px', border: 'none', background: '#222', color: '#fff', fontSize: '0.9rem' }}
                        />
                        <input
                            type="number"
                            placeholder="Amount ($)"
                            value={newMilestone.amount}
                            onChange={e => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: 'none', background: '#222', color: '#fff', fontSize: '0.9rem' }}
                        />
                        <button onClick={handleAddMilestone} className="btn-neon" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Add</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {milestones.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>No milestones yet. Add one to start tracking.</div>
                ) : milestones.map((m, idx) => (
                    <div key={m.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px',
                        background: m.status === 'paid' ? 'rgba(0,255,100,0.05)' : 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${m.status === 'paid' ? 'var(--neon-green)' : m.status === 'submitted' ? 'orange' : '#555'}`
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', color: m.status === 'paid' ? '#ccc' : '#fff' }}>
                                {m.description}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount: ${m.amount}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 'bold',
                                padding: '2px 8px', borderRadius: '10px',
                                background: m.status === 'submitted' ? 'rgba(255,165,0,0.2)' : m.status === 'paid' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                                color: m.status === 'submitted' ? 'orange' : m.status === 'paid' ? 'var(--neon-lime)' : '#aaa'
                            }}>
                                {m.status.toUpperCase().replace('_', ' ')}
                            </span>
                            {m.status === 'submitted' && (
                                <button
                                    className="btn-neon"
                                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                                    onClick={() => handleApprove(m.id)}
                                >
                                    P A Y
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmployerProfileView = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [profile, setProfile] = React.useState({
        companyName: 'Acme Corp',
        industry: 'Technology',
        description: 'Leading provider of innovative roadrunner catching solutions.',
        website: 'www.acmecorp.com',
        location: 'San Francisco, CA'
    });

    const handleSave = () => {
        setTimeout(() => {
            setIsEditing(false);
            alert("Company Profile Updated (Demo Mode)");
        }, 500);
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Company Profile</h2>
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '5px 15px', borderRadius: '5px' }}>Cancel</button>
                        <button onClick={handleSave} className="btn-neon" style={{ padding: '5px 15px' }}>Save Changes</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-neon" style={{ padding: '5px 15px' }}>Edit Profile</button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '30px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>
                        {profile.companyName.charAt(0)}
                    </div>
                    {isEditing ? (
                        <input className="neon-input" value={profile.companyName} onChange={e => setProfile({ ...profile, companyName: e.target.value })} style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }} />
                    ) : (
                        <h3 style={{ margin: 0, color: 'var(--neon-cyan)' }}>{profile.companyName}</h3>
                    )}
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#0f0', border: '1px solid #0f0', display: 'inline-block', padding: '2px 10px', borderRadius: '15px' }}>VERIFIED EMPLOYER</div>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div className="glass-panel" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>Industry</label>
                        {isEditing ? <input className="neon-input" value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })} /> : <div style={{ color: '#fff' }}>{profile.industry}</div>}
                    </div>
                    <div className="glass-panel" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>Website</label>
                        {isEditing ? <input className="neon-input" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} /> : <a href={'http://' + profile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)' }}>{profile.website}</a>}
                    </div>
                    <div className="glass-panel" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>Location</label>
                        {isEditing ? <input className="neon-input" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} /> : <div style={{ color: '#fff' }}>{profile.location}</div>}
                    </div>
                    <div className="glass-panel" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>About</label>
                        {isEditing ? <textarea className="neon-input" rows="3" value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} /> : <div style={{ color: '#ddd', fontSize: '0.9rem', lineHeight: '1.5' }}>{profile.description}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmployerDashboard = () => {
    const [showReview, setShowReview] = React.useState(null);
    const [isVerified, setIsVerified] = React.useState(false);
    const [jobs, setJobs] = React.useState([]);
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
    const [editingJob, setEditingJob] = React.useState(null);
    const [showHireModal, setShowHireModal] = React.useState(null);
    const [chatContext, setChatContext] = React.useState({
        roomId: "employer-global-201",
        title: "Employer Comms"
    });
    const [walletBalance, setWalletBalance] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchWalletBalance = () => {
        setRefreshing(true);
        fetch('https://world-job-backend.vercel.app/payment/balance/201')
            .then(res => res.json())
            .then(data => setWalletBalance(data.balance || 0))
            .catch(console.error)
            .finally(() => setTimeout(() => setRefreshing(false), 500));
    };

    React.useEffect(() => {
        fetchWalletBalance();
    }, []);

    const fetchJobs = () => {
        fetch('https://world-job-backend.vercel.app/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formattedJobs = data.map(p => ({
                        ...p,
                        ...p.details,
                        id: p.id,
                        title: p.name, // Project.name is the title
                        status: p.status === 'pending' ? 'Active' : p.status,
                        posted: 'Recently',
                        applicants: p.applicants || []
                    }));
                    // Filter to show only relevant jobs if needed, or all for now
                    // Note: Projects backend stores name as 'name'. Service maps `jobTitle` to `name`.
                    if (formattedJobs.length > 0) setJobs(formattedJobs);
                } else {
                    console.error("Projects API returned non-array:", data);
                }
            })
            .catch(err => console.error(err));
    };

    React.useEffect(() => {
        fetch('https://world-job-backend.vercel.app/verification/status/201')
            .then(res => res.json())
            .then(data => setIsVerified(data.isVerified))
            .catch(console.error);

        fetchJobs();
    }, []);

    const [recommendations, setRecommendations] = React.useState([
        { id: 101, name: 'Alice Developer', skills: ['React', 'Node.js'], matchScore: 95, matchReasons: ['Rising Star', 'Top Rated'] },
        { id: 102, name: 'Bob Backend', skills: ['Python', 'Django'], matchScore: 88, matchReasons: ['Quick Responder'] },
        { id: 103, name: 'Charlie Design', skills: ['Figma', 'UI/UX'], matchScore: 82, matchReasons: ['Creative Visionary'] },
    ]);

    const [showDispute, setShowDispute] = React.useState(null);
    const [showSupport, setShowSupport] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('manage-jobs'); // Fixed default
    const [newJob, setNewJob] = React.useState({ title: '', description: '', budget: '', skills: '' });

    const handleZoomMeeting = async (project) => {
        if (!window.confirm(`Schedule a Zoom meeting for "${project.title}"?`)) return;
        try {
            const participants = ['201'];
            const res = await fetch('https://world-job-backend.vercel.app/zoom/create-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: `Project Meeting: ${project.title}`,
                    startTime: new Date(Date.now() + 60000).toISOString(),
                    participants
                })
            });
            if (res.ok) {
                const data = await res.json();
                alert(`Meeting Scheduled!\n\nJoin URL: ${data.joinUrl}\nPassword: ${data.password}`);
            } else {
                const err = await res.text();
                alert("Failed to schedule meeting: " + JSON.stringify(err));
            }
        } catch (e) {
            console.error(e);
            alert("Error scheduling meeting.");
        }
    };


    const handleJobSubmit = (jobData) => {
        // Map frontend fields to backend Project fields
        // JobPostTemplate uses 'jobTitle' and 'salaryMax', ensuring we grab those or fallbacks
        const payload = {
            jobTitle: jobData.jobTitle || jobData.title,
            description: jobData.description,
            salaryMax: jobData.salaryMax || jobData.budget,
            employerId: '201',
            details: { ...jobData } // Keep raw data in details
        };

        const url = editingJob
            ? `https://world-job-backend.vercel.app/projects/${editingJob.id}/update`
            : `https://world-job-backend.vercel.app/projects`;

        fetch(url, {
            method: 'POST', // Both create and update use POST in this setup
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                alert('Job Posted Successfully!');
                setEditingJob(null);
                setActiveSection('manage-jobs');
                fetchJobs(); // Refresh the list
            })
            .catch(err => alert("Error: " + err.message));
    };

    const handlePermitCreation = async (workerId, amount) => {
        try {
            const payload = {
                jobType: (showHireModal.jobType || 'FREELANCE').toUpperCase(),
                jobId: showHireModal.id,
                buyerId: '201',
                workerId: workerId,
                totalAmount: Number(amount),
                currency: 'USD',
            };

            const res = await fetch('https://world-job-backend.vercel.app/work-permit/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create permit');
            }

            const permit = await res.json();

            if (showHireModal.title) {
                await fetch(`https://world-job-backend.vercel.app/work-permit/${permit.id}/details`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: showHireModal.title,
                        description: showHireModal.description,
                        userId: '201'
                    })
                });
            }

            alert(`🎉 Work Permit Created Successfully! (ID: ${permit.id})\nThe worker has been notified.`);
            setShowHireModal(null);
            setActiveSection('work-permits');
        } catch (error) {
            console.error(error);
            alert('Error creating work permit: ' + error.message);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'post-job':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>{editingJob ? 'Edit Job' : 'Post a New Job'}</h2>
                            <button onClick={() => setActiveSection('manage-jobs')} style={{ background: 'transparent', border: '1px solid #666', color: '#ccc', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        <JobPostTemplate
                            initialData={editingJob ? editingJob.details || {} : {}}
                            onSubmit={handleJobSubmit}
                        />
                    </div>
                );
            case 'work-permits':
                return <EmployerWorkPermitPanel />;
            case 'daily-labor':
                return <DailyLaborMarketplace userId="201" role="employer" />;
            case 'emergency':
                return <EmployerEmergencyPanel />;
            case 'worker-requests':
                return <WorkerRequestsFeed />;
            case 'time-logs':
                return <TimeSheetView />;
            case 'verification':
                return <VerificationWidget userId="201" role="employer" />;
            case 'investment-portal':
                return <InvestorPortalView />;
            case 'enterprise-gov':
                return <GovernmentEnterprisePortal />;
            case 'financials':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Financials & Wallet</h2>
                        <FinancialsPanel userId="201" role="employer" onBalanceUpdate={fetchWalletBalance} />
                    </div>
                );
            case 'referral':
                return (
                    <ReferralDashboard
                        user={{
                            referralCode: 'EMPLOYER-201',
                            referralEarnings: 450,
                            referralCount: 3
                        }}
                    />
                );
            case 'security':
                return <SecuritySettings userId="201" />;
            case 'manage-jobs':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Manage Jobs</h2>
                        <div style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                            {jobs.map(job => (
                                <div key={job.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Posted {job.posted} • {job.applicants?.length || 0} Applicants</p>
                                        <EmployerMilestoneView projectId={job.id} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => setChatContext({ roomId: 'project-' + job.id, title: job.title + ' Chat' })} style={{ padding: '5px', background: 'transparent', border: '1px solid var(--neon-cyan)', borderRadius: '5px', cursor: 'pointer', color: 'var(--neon-cyan)', fontSize: '0.8rem' }}>💬</button>
                                        <button onClick={() => setShowHireModal(job)} style={{ padding: '5px 15px', background: 'var(--neon-purple)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}>👥 View Applicants / Hire</button>
                                        <button onClick={() => { setEditingJob(job); setActiveSection('post-job'); }} style={{ padding: '5px 15px', background: 'var(--neon-cyan)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#000' }}>Edit</button>
                                        <button onClick={() => setShowReview(job.id)} style={{ padding: '5px 15px', background: 'transparent', border: '1px solid var(--neon-lime)', borderRadius: '5px', cursor: 'pointer', color: 'var(--neon-lime)' }}>Review</button>
                                        <button onClick={() => setShowDispute(job.id)} style={{ padding: '5px 15px', background: 'transparent', border: '1px solid red', borderRadius: '5px', cursor: 'pointer', color: 'red' }}>Dispute</button>
                                        <button onClick={() => handleZoomMeeting(job)} style={{ padding: '5px 15px', background: 'transparent', border: '1px solid var(--neon-purple)', borderRadius: '5px', cursor: 'pointer', color: 'var(--neon-purple)' }}>🎥 Zoom</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showReview && <ReviewModal projectId={showReview} onClose={() => setShowReview(null)} />}
                        {showHireModal && <ApplicantSelectionModal job={showHireModal} onClose={() => setShowHireModal(null)} onHire={handlePermitCreation} />}
                        {showDispute && <DisputeForm projectId={showDispute} onClose={() => setShowDispute(null)} />}
                    </div>
                );
            case 'profile':
                return <EmployerProfileView />;
            case 'talent-search':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Find Talent (AI Powered)</h2>
                        <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Search by skills or name..." style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            <button className="btn-neon">Search</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {recommendations.map(worker => (
                                <div key={worker.id} style={{ minWidth: '200px', background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '50%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{worker.name.charAt(0)}</div>
                                    <h4>{worker.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{worker.matchScore}% Match</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ErrorBoundary>
            <NotificationProvider userId="201" role="employer">
                <div className="container" style={{ paddingTop: '80px' }}>
                    <NotificationBanner />
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Logo size="2.5rem" />
                            <span className="text-gradient" style={{ fontSize: '1.5rem', borderLeft: '1px solid #333', paddingLeft: '20px', '--neon-pink': 'var(--neon-cyan)', '--neon-purple': 'var(--neon-lime)' }}>Employer Panel</span>
                            {isVerified && <span style={{ marginLeft: '15px', fontSize: '0.8rem', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--neon-lime)', color: 'var(--neon-lime)', padding: '4px 10px', borderRadius: '20px' }}>🛡️ VERIFIED</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div className="glass-panel" style={{ padding: '8px 15px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                <button
                                    onClick={fetchWalletBalance}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--neon-cyan)',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        transition: 'transform 0.5s ease',
                                        transform: refreshing ? 'rotate(360deg)' : 'none'
                                    }}
                                    title="Refresh Balance"
                                >
                                    ↻
                                </button>
                            </div>
                            <button onClick={() => { setEditingJob(null); setActiveSection('post-job'); }} className="btn-neon" style={{ padding: '8px 20px', fontSize: '0.9rem', cursor: 'pointer' }}>Post a Job</button>
                            <div className="glass-panel" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--neon-cyan)' }}></div>
                            <NotificationBell />
                        </div>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                        <aside className="glass-panel" style={{ height: '600px', borderRadius: '20px', padding: '20px' }}>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('manage-jobs'); }} style={{ color: activeSection === 'manage-jobs' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Manage Jobs</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('work-permits'); }} style={{ color: activeSection === 'work-permits' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Work Permits (Approvals)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('talent-search'); }} style={{ color: activeSection === 'talent-search' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Talent Search</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('daily-labor'); }} style={{ color: activeSection === 'daily-labor' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Daily Labor (Offline)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('emergency'); }} style={{ color: activeSection === 'emergency' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>🚨 Emergency Response</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('worker-requests'); }} style={{ color: activeSection === 'worker-requests' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Worker Requests</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('financials'); }} style={{ color: activeSection === 'financials' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Financials & Wallet</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('referral'); }} style={{ color: activeSection === 'referral' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>🎁 Refer & Earn</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('time-logs'); }} style={{ color: activeSection === 'time-logs' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Time Logs</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('verification'); }} style={{ color: activeSection === 'verification' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Get Verified {isVerified && '✅'}</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('profile'); }} style={{ color: activeSection === 'profile' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Company Profile</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('enterprise-gov'); }} style={{ color: activeSection === 'enterprise-gov' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>Enterprise & Gov</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('security'); }} style={{ color: activeSection === 'security' ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>🛡️ Security Center</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowSupport(true); }} style={{ color: '#aaa', transition: 'color 0.3s' }}>Support</a>
                                <Link to="/" style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>Logout</Link>
                            </nav>
                        </aside>

                        <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {renderContent()}
                            <Footer />
                        </main>
                    </div>
                    {showSupport && <SupportTicketForm onClose={() => setShowSupport(false)} />}
                    {/* Monetization Components and Chat commented out to prevent crash */}
                    {/* <UniversalChat roomId={chatContext.roomId} userId="201" userName="Acme Corp" userRole="employer" title={chatContext.title} /> */}
                </div>
            </NotificationProvider>
        </ErrorBoundary>
    );
};
export default EmployerDashboard;
