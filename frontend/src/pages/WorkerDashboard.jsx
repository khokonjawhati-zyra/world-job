import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ReviewModal from '../components/ReviewModal';
import DisputeForm from '../components/DisputeForm';
import SupportTicketForm from '../components/SupportTicketForm';
import TimeTracker from '../components/TimeTracker';
import WorkerRequestPanel from '../components/WorkerRequestPanel';
import VerificationWidget from '../components/VerificationWidget';
import FinancialsPanel from '../components/FinancialsPanel';
import DailyLaborMarketplace from '../components/DailyLaborMarketplace';
import { CareerLadder, SkillEndorsements } from '../components/CareerComponents';
import { CommunityGroupsPanel, MentorshipPanel } from '../components/CommunityComponents';
import { AdWidget, SubscriptionPlans } from '../components/MonetizationComponents';
import ReferralDashboard from '../components/ReferralDashboard';
import WorkerWorkPermitPanel from '../components/WorkerWorkPermitPanel';
import WorkerEmergencyPanel from '../components/WorkerEmergencyPanel';
import DigitalIdentityCard from '../components/DigitalIdentityCard';
import WorkerInvestmentPanel from '../components/WorkerInvestmentPanel';
import UniversalChat from '../components/UniversalChat';
import SecuritySettings from '../components/SecuritySettings';
import Footer from '../components/Footer';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationBanner from '../components/NotificationBanner';
import NotificationBell from '../components/NotificationBell';


const WorkerDashboard = () => {
    const [showReview, setShowReview] = React.useState(null);
    const [isVerified, setIsVerified] = React.useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
    const [walletBalance, setWalletBalance] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchWalletBalance = () => {
        setRefreshing(true);
        const p1 = fetch('http://localhost:3001/payment/balance/101')
            .then(res => res.json())
            .then(data => setWalletBalance(data.balance || 0))
            .catch(console.error);

        const p2 = fetchStats(); // Also refresh stats

        Promise.all([p1, p2]).finally(() => {
            // Small delay for visual effect
            setTimeout(() => setRefreshing(false), 500);
        });
    };

    const [stats, setStats] = React.useState({ earnings: 0, pending: 0, withdrawn: 0 });

    React.useEffect(() => {
        // Quick check for badge in header
        fetch('http://localhost:3001/verification/status/101')
            .then(res => res.json())
            .then(data => setIsVerified(data.isVerified))
            .catch(console.error);

        fetchWalletBalance();
        fetchStats();
    }, []);

    const fetchStats = () => {
        fetch('http://localhost:3001/payment/transactions/101')
            .then(res => res.json())
            .then(data => {
                const history = data.history || [];
                const earnings = history
                    .filter(tx => tx.flow === 'IN')
                    .reduce((acc, tx) => acc + Number(tx.amount), 0);
                const withdrawn = history
                    .filter(tx => tx.type === 'WITHDRAWAL')
                    .reduce((acc, tx) => acc + Number(tx.amount), 0);
                // "Locked" balance from the endpoint response represents pending clearance/escrow usually
                const pending = data.locked ? (Number(data.locked.USD) + Number(data.locked.BDT)) : 0;

                setStats({ earnings, withdrawn, pending });
            })
            .catch(console.error);
    };

    const [showDispute, setShowDispute] = React.useState(null);
    const [showSupport, setShowSupport] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [selectedJob, setSelectedJob] = React.useState(null);
    // const [appliedJobs, setAppliedJobs] = React.useState([]); // Removed duplicate declaration
    const [allJobs, setAllJobs] = React.useState([]);

    React.useEffect(() => {
        // Fetch all open jobs
        fetch('http://localhost:3001/projects')
            .then(res => res.json())
            .then(data => {
                // Filter for pending/active jobs if needed
                const activeJobs = data.filter(j => j.status === 'pending');
                setAllJobs(activeJobs);
            })
            .catch(console.error);
    }, [activeSection]); // Refetch when switching tabs

    const [careerProfile, setCareerProfile] = React.useState(null);

    React.useEffect(() => {
        if (activeSection === 'career') {
            fetch('http://localhost:3001/profiles/101?role=worker')
                .then(res => res.json())
                .then(data => setCareerProfile(data))
                .catch(err => {
                    console.warn("Career Fetch Failed (Demo Mode):", err);
                    setCareerProfile({
                        careerLevel: 'Professional',
                        xp: 2450,
                        skills: ['React', 'Node.js', 'UI/UX'],
                        endorsements: [
                            { skill: 'React', endorserName: 'Tech Corp', date: '2025-10-15' },
                            { skill: 'UI/UX', endorserName: 'Design Studio', date: '2025-11-01' }
                        ]
                    });
                });
        }
    }, [activeSection]);

    // Chat Context State
    // Chat Context State
    const [chatContext, setChatContext] = React.useState({
        roomId: "worker-global-101",
        title: "Worker Comms"
    });

    // Initialize appliedJobs from localStorage
    const [appliedJobs, setAppliedJobs] = React.useState(() => {
        const saved = localStorage.getItem('appliedJobs_101');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever appliedJobs changes
    React.useEffect(() => {
        localStorage.setItem('appliedJobs_101', JSON.stringify(appliedJobs));
    }, [appliedJobs]);

    const handleApply = (jobId) => {
        // Optimistic Update
        setAppliedJobs((prev) => {
            if (prev.includes(jobId)) return prev;
            return [...prev, jobId];
        });

        // Call Backend
        fetch(`http://localhost:3001/projects/${jobId}/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workerId: '101' })
        }).catch(err => {
            console.error("Failed to apply:", err);
            // Optionally revert state here if needed
        });
    };

    const handleZoomMeeting = async (project) => {
        if (!window.confirm("Schedule a Zoom meeting for this project?")) return;
        try {
            // Include workerId and employer ID (if available) as participants
            // For this mock "My Jobs" section, project 103 might not have employerId readily available in the object unless we fetch it.
            // But we can just pass the worker ID '101' for now to test notification.
            const participants = ['101'];
            if (project.employerId) participants.push(String(project.employerId));

            const res = await fetch('http://localhost:3001/zoom/create-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: `Meeting for Project #${project.id} - ${project.name || 'Discussion'}`,
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


    // AI Matching Logic
    const [recommendedJobs, setRecommendedJobs] = React.useState([]);
    // Mocking the current worker profile. In a real app, this comes from the auth context.
    const currentWorkerProfile = {
        name: "Alice Dev",
        skills: ["React", "JavaScript", "HTML"],
        experience: 3,
        bio: "React enthusiast looking for frontend roles."
    };

    React.useEffect(() => {
        // Dynamic import logic
        import('../services/AIMatchingService').then(module => {
            const { AIMatchingService, MOCK_JOBS } = module;
            const recs = AIMatchingService.getRecommendedJobs(currentWorkerProfile, MOCK_JOBS);
            setRecommendedJobs(recs);
        });
    }, []);

    const renderContent = () => {
        switch (activeSection) {
            case 'digital-id':
                return <DigitalIdentityCard userId="101" />;
            case 'verification':
                return <VerificationWidget userId="101" userType="WORKER" />;
            case 'time-tracker':
                return <TimeTracker workerId="101" />;
            case 'daily-labor':
                return <DailyLaborMarketplace userId="101" role="worker" />;
            case 'my-requests':
                return <WorkerRequestPanel />;
            case 'emergency':
                return <WorkerEmergencyPanel />;
            case 'work-permits':
                // Passed onBalanceUpdate to allow panel to refresh header after withdrawal/actions
                return <WorkerWorkPermitPanel onBalanceUpdate={fetchWalletBalance} />;
            case 'career':

                return careerProfile ? (
                    <>
                        <CareerLadder currentLevel={careerProfile.careerLevel} xp={careerProfile.xp} />
                        <SkillEndorsements
                            skills={careerProfile.skills}
                            endorsements={careerProfile.endorsements}
                            canEndorse={false} // Workers normally can't endorse themselves
                        />
                    </>
                ) : (<div>Loading Career Data...</div>);
            case 'community':
                return (
                    <div style={{ display: 'grid', gap: '30px' }}>
                        <CommunityGroupsPanel userId="101" />
                        <MentorshipPanel userId="101" />
                    </div>
                );
            case 'referral':
                return (
                    <ReferralDashboard
                        user={{
                            ...careerProfile,
                            referralCode: 'WORKER-101',
                            referralEarnings: 1250,
                            referralCount: 12
                        }}
                    />
                );
            case 'find-jobs':
                if (selectedJob) {
                    return (
                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                            <button
                                onClick={() => setSelectedJob(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    marginBottom: '20px'
                                }}
                            >
                                ← Back to Jobs
                            </button>
                            <h2>{selectedJob.name} (Project #{selectedJob.id})</h2>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--neon-lime)', fontWeight: 'bold' }}>
                                        ${selectedJob.details?.salaryMin || 0} - ${selectedJob.details?.salaryMax || selectedJob.value} ({selectedJob.details?.salaryType || 'Fixed'})
                                    </span>
                                    <button
                                        className="btn-neon"
                                        style={{
                                            opacity: appliedJobs.includes(selectedJob.id) ? 0.6 : 1,
                                            cursor: appliedJobs.includes(selectedJob.id) ? 'default' : 'pointer',
                                            background: appliedJobs.includes(selectedJob.id) ? 'transparent' : 'var(--neon-pink)',
                                            border: appliedJobs.includes(selectedJob.id) ? '1px solid var(--text-muted)' : '',
                                            color: appliedJobs.includes(selectedJob.id) ? 'var(--text-muted)' : '#fff'
                                        }}
                                        onClick={() => {
                                            if (window.confirm("Use AI to generate a proposal for this job?")) {
                                                fetch('http://localhost:3001/matching/proposal', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ jobId: selectedJob.id, workerId: '101' })
                                                })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        const userMsg = prompt("AI Generated Proposal:\n\n" + data.proposal + "\n\n(Edit or click OK to send)", data.proposal);
                                                        if (userMsg) {
                                                            handleApply(selectedJob.id);
                                                            alert("Application Sent!");
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.error(err);
                                                        handleApply(selectedJob.id);
                                                    });
                                            } else {
                                                handleApply(selectedJob.id);
                                            }
                                        }}
                                        disabled={appliedJobs.includes(selectedJob.id)}
                                    >
                                        {appliedJobs.includes(selectedJob.id) ? 'Applied' : '✨ AI Apply'}
                                    </button>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                    <h3>Job Description</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                                        {selectedJob.details?.description || selectedJob.description || 'No detailed description provided.'}
                                    </p>

                                    <h3 style={{ marginTop: '20px' }}>Details & Requirements</h3>
                                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 'bold' }}>Category</p>
                                            <p style={{ color: 'var(--text-muted)' }}>{selectedJob.details?.jobCategory || 'General'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 'bold' }}>Work Mode</p>
                                            <p style={{ color: 'var(--text-muted)' }}>{selectedJob.details?.workMode || 'Remote'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 'bold' }}>Experience Level</p>
                                            <p style={{ color: 'var(--text-muted)' }}>{selectedJob.details?.experienceLevel || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 'bold' }}>Job Type</p>
                                            <p style={{ color: 'var(--text-muted)' }}>{selectedJob.details?.jobType || 'Contract'}</p>
                                        </div>
                                    </div>

                                    <h3 style={{ marginTop: '20px' }}>Skills</h3>
                                    <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                                        {selectedJob.details?.skills ?
                                            selectedJob.details.skills.split(',').map(s => <li key={s}>{s.trim()}</li>) :
                                            <li>No specific skills listed.</li>
                                        }
                                    </ul>

                                    {selectedJob.details?.benefits && (
                                        <>
                                            <h3 style={{ marginTop: '20px' }}>Benefits</h3>
                                            <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>{selectedJob.details.benefits}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Find Jobs</h2>

                        {/* AI Recommendations Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ color: 'var(--neon-pink)', marginBottom: '15px' }}>✨ Recommended For You</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {recommendedJobs.map(job => (
                                    <div key={job.id} style={{ background: 'rgba(255,105,180,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-pink)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px', background: 'var(--neon-pink)', borderRadius: '0 0 0 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {job.matchScore} Match Score
                                        </div>
                                        <h3 style={{ marginBottom: '10px' }}>{job.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                                            {job.description.substring(0, 80)}...
                                        </p>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                            {job.matchReasons && job.matchReasons.map((reason, idx) => (
                                                <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(204, 255, 0, 0.2)', color: 'var(--neon-lime)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--neon-lime)' }}>
                                                    {reason}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                            {job.requiredSkills.map(skill => (
                                                <span key={skill} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{skill}</span>
                                            ))}
                                        </div>
                                        <button className="btn-neon" style={{ width: '100%', fontSize: '0.9rem' }}>View Details</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3>All Jobs</h3>
                        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                            {allJobs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No active jobs found.</p> : allJobs.map(job => (
                                <div key={job.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div
                                        onClick={() => setSelectedJob(job)}
                                        style={{ cursor: 'pointer', flex: 1 }}
                                    >
                                        <h3 style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--neon-pink)'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                                            {job.name} (Project #{job.id})
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>{job.details?.description || job.description || 'No description provided.'}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{job.details?.workMode || 'Remote'}</span>
                                            {job.details?.skills && job.details.skills.split(',').slice(0, 3).map(skill => (
                                                <span key={skill} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', marginLeft: '5px' }}>{skill.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: 'var(--neon-lime)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ${job.details?.salaryMin || 0} - ${job.details?.salaryMax || job.value}
                                        </p>
                                        <button
                                            className="btn-neon"
                                            style={{
                                                marginTop: '10px',
                                                padding: '5px 15px',
                                                fontSize: '0.9rem',
                                                opacity: appliedJobs.includes(job.id) ? 0.6 : 1,
                                                cursor: appliedJobs.includes(job.id) ? 'default' : 'pointer',
                                                background: appliedJobs.includes(job.id) ? 'transparent' : 'var(--neon-pink)',
                                                border: appliedJobs.includes(job.id) ? '1px solid var(--text-muted)' : '',
                                                color: appliedJobs.includes(job.id) ? 'var(--text-muted)' : '#fff'
                                            }}
                                            onClick={() => handleApply(job.id)}
                                            disabled={appliedJobs.includes(job.id)}
                                        >
                                            {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'my-jobs':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>My Jobs</h2>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ background: 'rgba(0,255,100,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-lime)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>E-commerce Website Fixes</h3>
                                    <span style={{ color: 'var(--neon-lime)' }}>In Progress</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>Deadline: 2 Days left</p>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '10px' }}>
                                    <div style={{ width: '60%', height: '100%', background: 'var(--neon-lime)', borderRadius: '3px' }}></div>
                                </div>
                                <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
                                    <MilestoneList projectId="103" />
                                </div>
                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setShowReview('101')} className="btn-neon" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>Rate Employer</button>
                                    <button onClick={() => setChatContext({ roomId: 'project-103', title: 'Project #103 Chat' })} className="btn-neon" style={{ fontSize: '0.8rem', padding: '5px 10px', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}>💬 Chat with Employer</button>
                                    <button onClick={() => handleZoomMeeting({ id: '103', name: 'E-commerce Website Fixes', employerId: '202' })} className="btn-neon" style={{ fontSize: '0.8rem', padding: '5px 10px', borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>🎥 Schedule Meeting</button>
                                    <button onClick={() => setShowDispute('101')} className="btn-neon" style={{ fontSize: '0.8rem', padding: '5px 10px', borderColor: 'red', color: 'red' }}>File Dispute</button>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>No completed jobs yet.</p>
                        </div>
                        {showReview && <ReviewModal projectId={showReview} onClose={() => setShowReview(null)} />}
                        {showDispute && <DisputeForm projectId={showDispute} onClose={() => setShowDispute(null)} />}
                    </div>
                );
            case 'earnings':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Earnings & Withdrawal</h2>

                        {/* Summary Cards (Mock Analytics for now) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Net Earnings</p>
                                <h3 style={{ fontSize: '2rem', color: 'var(--neon-lime)', margin: '10px 0' }}>${stats.earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Pending Clearance</p>
                                <h3 style={{ fontSize: '2rem', color: 'var(--neon-purple)', margin: '10px 0' }}>${stats.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>All Time Withdrawn</p>
                                <h3 style={{ fontSize: '2rem', color: '#fff', margin: '10px 0' }}>${stats.withdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                            </div>
                        </div>

                        {/* Real Financial Functional Panel */}
                        <FinancialsPanel userId="101" role="worker" onBalanceUpdate={fetchWalletBalance} />
                    </div>
                );
            case 'investment':
                return <WorkerInvestmentPanel userId="101" />;
            case 'dashboard':
            default:
                return (
                    <>
                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                            <h2>Active Jobs</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>No active jobs found.</p>
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                            <h2>Recent Jobs</h2>
                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px' }}>
                                        <div style={{ height: '100px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '10px' }}></div>
                                        <h4>Logo Design #{i}</h4>
                                        <p style={{ color: 'var(--neon-lime)', fontSize: '0.9rem' }}>$50.00</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <NotificationProvider userId="101" role="worker">
            <div className="container" style={{ paddingTop: '80px' }} >
                <NotificationBanner />
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Logo size="2.5rem" />
                        <span className="text-gradient" style={{ fontSize: '1.5rem', borderLeft: '1px solid #333', paddingLeft: '20px' }}>Worker Panel</span>
                        {isVerified && (
                            <span style={{
                                marginLeft: '15px',
                                fontSize: '0.8rem',
                                background: 'rgba(0,255,0,0.1)',
                                border: '1px solid var(--neon-lime)',
                                color: 'var(--neon-lime)',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                🛡️ VERIFIED
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="glass-panel" style={{ padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>Balance: ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <button
                                onClick={fetchWalletBalance}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--neon-pink)',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    transition: 'transform 0.5s ease',
                                    transform: refreshing ? 'rotate(360deg)' : 'none'
                                }}
                                title="Refresh Balance"
                            >
                                ↻
                            </button>
                        </div>
                        <div className="glass-panel" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--neon-pink)' }}></div>
                        <NotificationBell />
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                    <aside className="glass-panel" style={{ position: 'sticky', top: '20px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '20px' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '100%' }}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
                                style={{ color: activeSection === 'dashboard' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Dashboard
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('find-jobs'); }}
                                style={{ color: activeSection === 'find-jobs' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Find Jobs
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('my-jobs'); }}
                                style={{ color: activeSection === 'my-jobs' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                My Jobs
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('work-permits'); }}
                                style={{ color: activeSection === 'work-permits' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Work Permits (Active)
                            </a>

                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('earnings'); }}
                                style={{ color: activeSection === 'earnings' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Earnings
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('investment'); }}
                                style={{ color: activeSection === 'investment' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Investment Hub 🚀
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('verification'); }}
                                style={{ color: activeSection === 'verification' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Get Verified {isVerified && '✅'}
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('digital-id'); }}
                                style={{ color: activeSection === 'digital-id' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Global ID & Identity
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('daily-labor'); }}
                                style={{ color: activeSection === 'daily-labor' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Daily Labor (Offline)
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('emergency'); }}
                                style={{ color: activeSection === 'emergency' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                🚨 Emergency Response
                            </a>
                            <a
                                href="#"

                                onClick={(e) => { e.preventDefault(); setActiveSection('time-tracker'); }}
                                style={{ color: activeSection === 'time-tracker' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Time Tracker
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('my-requests'); }}
                                style={{ color: activeSection === 'my-requests' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                My Job Requests
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('career'); }}
                                style={{ color: activeSection === 'career' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Skill Growth & Career
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('community'); }}
                                style={{ color: activeSection === 'community' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Community & Mentorship
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('referral'); }}
                                style={{ color: activeSection === 'referral' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                🎁 Refer & Earn
                            </a>

                            <div style={{ padding: '15px', marginTop: '10px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px', border: '1px solid gold', textAlign: 'center' }}>
                                <div style={{ color: 'gold', fontWeight: 'bold', marginBottom: '5px' }}>⚡ Go Pro</div>
                                <p style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '10px' }}>Get more jobs & visibility</p>
                                <button onClick={() => setShowUpgradeModal(true)} style={{ background: 'gold', color: '#000', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Upgrade</button>
                            </div>

                            <Link to="/profile/worker/101" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>
                                My Profile
                            </Link>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveSection('security'); }}
                                style={{ color: activeSection === 'security' ? 'var(--neon-pink)' : 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                🛡️ Security Center
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setShowSupport(true); }}
                                style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                            >
                                Support
                            </a>
                            <Link to="/" style={{ marginTop: 'auto', color: 'var(--text-muted)', textDecoration: 'none' }}>Logout</Link>
                        </nav>
                        <AdWidget role="worker" />
                    </aside>

                    <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {activeSection === 'security' ? <SecuritySettings userId="101" /> : renderContent()}
                        <Footer />
                    </main>
                </div>
                {showSupport && <SupportTicketForm onClose={() => setShowSupport(false)} />}
                {showUpgradeModal && <SubscriptionPlans role="worker" onClose={() => setShowUpgradeModal(false)} onBalanceUpdate={fetchWalletBalance} />}
                <UniversalChat
                    roomId={chatContext.roomId}
                    userId="101"
                    userName="Alice Dev"
                    userRole="worker"
                    title={chatContext.title}
                />
            </div>
        </NotificationProvider>
    );
};
// Helper Component for Milestones
const MilestoneList = ({ projectId }) => {
    const [milestones, setMilestones] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchMilestones = () => {
        // In a real app, you might fetch /projects/:id and extract milestones
        // For now we'll fetch all projects and find the one we want because the projectsService.findAll is available
        // But better is to use a specific endpoint if existing.
        // Let's assume we can fetch the project details from /projects (which returns all)
        fetch('http://localhost:3001/projects')
            .then(res => res.json())
            .then(data => {
                const project = data.find(p => p.id === projectId);
                if (project && project.milestones) {
                    setMilestones(project.milestones);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    React.useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const handleSubmit = (mId) => {
        fetch(`http://localhost:3001/projects/${projectId}/milestones/${mId}/submit`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                alert('Milestone Submitted!');
                fetchMilestones();
            })
            .catch(err => alert('Error: ' + err.message));
    };

    if (loading) return <div>Loading Milestones...</div>;
    if (milestones.length === 0) return <div>No milestones defined.</div>;

    return (
        <div>
            <h4 style={{ marginBottom: '10px' }}>Project Milestones</h4>
            {milestones.map((m, idx) => {
                // Logic: Can only submit if status is pending AND previous is paid (or if it's the first one)
                // Actually, previous needs to be 'paid' OR 'completed'. But current logic in backend is strict 'paid'.
                // Also, backend enforces sequential submission, so we should visually enforce it too.
                const isPreviousPaid = idx === 0 || milestones[idx - 1].status === 'paid';
                const canSubmit = m.status === 'pending' && isPreviousPaid;

                return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.9rem', opacity: isPreviousPaid ? 1 : 0.5 }}>
                        <span style={{ color: m.status === 'paid' ? 'var(--neon-green)' : '#fff' }}>
                            {idx + 1}. {m.description} (${m.amount})
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: m.status === 'paid' ? 'var(--neon-lime)' : m.status === 'submitted' ? 'orange' : 'var(--text-muted)' }}>
                                {m.status.toUpperCase()}
                            </span>
                            {canSubmit && (
                                <button
                                    className="btn-neon"
                                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                                    onClick={() => handleSubmit(m.id)}
                                >
                                    Submit Work
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WorkerDashboard;
