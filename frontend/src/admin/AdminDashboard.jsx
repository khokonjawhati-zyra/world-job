
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

import { CommissionService } from '../services/CommissionService';
import AdminVerificationPanel from '../components/AdminVerificationPanel';
import AdminCategoryPanel from '../components/AdminCategoryPanel';
import AdminUserManagement from '../components/AdminUserManagement'; // New Component

import FinancialServicesPanel from '../components/FinancialServicesPanel';
import AdminFinancialOversight from '../components/AdminFinancialOversight';
import AdminLaborPanel from '../components/AdminLaborPanel';
import AdminPaymentControl from '../components/AdminPaymentControl';
import AdminPaymentSettings from '../components/AdminPaymentSettings';
import AdminZoomSettings from '../components/AdminZoomSettings';
import AdminAnalyticsPanel from '../components/AdminAnalyticsPanel';
import AdminPlanManager from '../components/AdminPlanManager';
import AdminEmergencyPanel from '../components/AdminEmergencyPanel';
import AdminWorkPermitPanel from '../components/AdminWorkPermitPanel';
import AiAdminCopilotPanel from '../components/AiAdminCopilotPanel';
import AdminInvestmentDashboard from '../components/AdminInvestmentDashboard';
import AdminLegalPanel from '../components/AdminLegalPanel';
import AdminCommunicationOverseer from '../components/AdminCommunicationOverseer';
import BroadcastCenter from '../components/BroadcastCenter';
import UniversalChat from '../components/UniversalChat';
import SecuritySettings from '../components/SecuritySettings';
import Footer from '../components/Footer';
import AdminTCEditor from '../components/AdminTCEditor';
import AdminTreasuryPanel from '../components/AdminTreasuryPanel';
import AdminSupportPanel from '../components/AdminSupportPanel';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationBanner from '../components/NotificationBanner';
import NotificationBell from '../components/NotificationBell';





// Integrated Support Dashboard
const SupportDashboard = () => {
    const [tickets, setTickets] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    const fetchTickets = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/support`)
            .then(res => res.json())
            .then(data => {
                setTickets(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch tickets:", err);
                setLoading(false);
            });
    };

    React.useEffect(() => {
        fetchTickets();
    }, []);

    const resolveTicket = (id) => {
        if (!window.confirm("Mark this ticket as resolved?")) return;

        fetch(`${API_BASE_URL}/support/${id}/resolve`, { method: 'PATCH' })
            .then(res => res.json())
            .then(() => {
                alert("Ticket Resolved!");
                fetchTickets();
            })
            .catch(err => alert("Error: " + err.message));
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'open') return t.status !== 'resolved';
        if (filter === 'resolved') return t.status === 'resolved';
        return true;
    });

    const getPriorityColor = (p) => {
        if (p === 'high') return 'red';
        if (p === 'medium') return 'orange';
        return 'green';
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>Support Help Desk</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '15px', border: '1px solid #444', background: '#222', color: '#fff' }}
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open / Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <button onClick={fetchTickets} className="btn-neon">Refresh</button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading Tickets...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredTickets.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No tickets found.</div>
                    ) : filteredTickets.map(ticket => (
                        <div key={ticket.id} style={{
                            padding: '20px',
                            background: ticket.status === 'resolved' ? 'rgba(0,255,0,0.02)' : 'rgba(255,50,50,0.05)',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                                        padding: '2px 8px', borderRadius: '4px',
                                        background: getPriorityColor(ticket.priority), color: '#fff'
                                    }}>
                                        {ticket.priority}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>#{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>by {ticket.userType} ({ticket.userId})</span>
                                </div>
                                <h3 style={{ margin: '5px 0', color: '#fff' }}>{ticket.subject}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ticket.description}</p>
                            </div>

                            <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold', color: ticket.status === 'resolved' ? 'var(--neon-lime)' : 'orange' }}>
                                    {ticket.status.toUpperCase()}
                                </div>
                                {ticket.status !== 'resolved' && (
                                    <button
                                        onClick={() => resolveTicket(ticket.id)}
                                        className="btn-neon"
                                        style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--neon-lime)', color: 'var(--neon-lime)' }}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PendingApprovalsWidget = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/work-permit/all`)
            .then(res => res.json())
            .then(data => {
                const pending = data.filter(p => p.status === 'PENDING_ADMIN_APPROVAL');
                setPendingItems(pending);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    React.useEffect(() => { fetchPending(); }, []);

    const handleQuickApprove = async (id) => {
        if (!confirm("Quick Approve this permit?")) return;
        try {
            await fetch(`${API_BASE_URL}/work-permit/${id}/admin-approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision: 'APPROVE' })
            });
            alert("Approved!");
            fetchPending();
        } catch (e) {
            alert("Error approving.");
        }
    };

    if (loading) return <div className="glass-panel" style={{ gridColumn: 'span 2' }}>Checking for pending approvals...</div>;
    if (pendingItems.length === 0) return null; // Don't show if nothing pending

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', gridColumn: 'span 2', border: '1px solid var(--neon-cyan)', background: 'rgba(0, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🔔 Action Required: Pending Work Permits ({pendingItems.length})
                </h3>
                <button onClick={fetchPending} className="btn-neon" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Refresh</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingItems.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{p.title || `Permit #${p.id}`}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Buyer: {p.buyerId} | Worker: {p.workerId} | <span style={{ color: 'var(--neon-lime)' }}>{p.currency} {p.totalAmount}</span>
                            </div>
                            {p.auditLogs?.some(l => l.action === 'WORK_SUBMITTED') && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)', marginTop: '4px', fontWeight: 'bold' }}>✅ Work Submitted (Needs Payment Release)</div>
                            )}
                        </div>
                        <button
                            onClick={() => handleQuickApprove(p.id)}
                            className="btn-neon"
                            style={{ background: 'var(--neon-green)', color: '#000', border: 'none', fontWeight: 'bold' }}
                        >
                            {p.auditLogs?.some(l => l.action === 'WORK_SUBMITTED') ? 'Approve & Pay' : 'Approve Permit'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dynamic Settings Panel
const SystemSettingsPanel = () => {
    const [settings, setSettings] = React.useState({ platformFee: 10, investorDividend: 30 });
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/settings/commission`)
            .then(res => res.json())
            .then(data => {
                setSettings({
                    platformFee: data.platformFeePercentage,
                    investorDividend: data.investorDividendPercentage
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch(`${API_BASE_URL}/settings/commission`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platformFee: Number(settings.platformFee),
                investorDividend: Number(settings.investorDividend)
            })
        })
            .then(res => res.json())
            .then(data => {
                setSettings({
                    platformFee: data.platformFeePercentage,
                    investorDividend: data.investorDividendPercentage
                });
                alert('Settings Updated Successfully!');
                setSaving(false);
            })
            .catch(() => {
                alert('Failed to update settings');
                setSaving(false);
            });
    };

    if (loading) return <div className="glass-panel" style={{ padding: '30px' }}>Loading Settings...</div>;

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>System Commission Settings</h2>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Platform Fee Percentage (%)
                </label>
                <input
                    type="number"
                    value={settings.platformFee}
                    onChange={e => setSettings({ ...settings, platformFee: e.target.value })}
                    style={{
                        width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1rem'
                    }}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                    Percentage of total project value deducted as fee. (e.g., 10%)
                </small>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Investor Dividend Payout (%)
                </label>
                <input
                    type="number"
                    value={settings.investorDividend}
                    onChange={e => setSettings({ ...settings, investorDividend: e.target.value })}
                    style={{
                        width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1rem'
                    }}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                    Percentage of the PLATFORM FEE distributed to investors. (e.g., 30% of the 10% fee)
                </small>
            </div>

            <button
                onClick={handleSave}
                className="btn-neon"
                disabled={saving}
                style={{ padding: '12px 30px', fontSize: '1rem', width: '100%' }}
            >
                {saving ? 'Saving...' : 'Save Configuration'}
            </button>
        </div>
    );
};

const AdminProfilePanel = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Super Admin',
        role: 'System Administrator',
        email: 'admin@worldjob.market',
        phone: '+1 (555) 019-9988',
        location: 'New York, USA (HQ)'
    });

    const handleSave = () => {
        // Simulate API delay
        setTimeout(() => {
            setIsEditing(false);
            alert("Profile Updated Successfully (Demo Mode)");
        }, 500);
    };

    return (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', borderBottom: '1px solid #333', paddingBottom: '30px', marginBottom: '30px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>
                    {profile.name.charAt(0)}
                </div>
                <div>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input className="neon-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
                            <input className="neon-input" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} placeholder="Role" />
                        </div>
                    ) : (
                        <>
                            <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>{profile.name}</h2>
                            <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>{profile.role} • {profile.email}</p>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <span style={{ padding: '5px 15px', background: 'rgba(0,255,0,0.1)', color: '#0f0', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #0f0' }}>Active</span>
                        <span style={{ padding: '5px 15px', background: 'rgba(0,255,255,0.1)', color: 'cyan', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid cyan' }}>Full Access</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                    <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '15px' }}>Contact Information</h4>

                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ color: '#888', fontSize: '0.8rem' }}>Email</label>
                            <input className="neon-input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                            <label style={{ color: '#888', fontSize: '0.8rem' }}>Phone</label>
                            <input className="neon-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                            <label style={{ color: '#888', fontSize: '0.8rem' }}>Location</label>
                            <input className="neon-input" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '10px' }}><label style={{ color: '#888', fontSize: '0.8rem' }}>Email</label><div style={{ color: '#fff' }}>{profile.email}</div></div>
                            <div style={{ marginBottom: '10px' }}><label style={{ color: '#888', fontSize: '0.8rem' }}>Phone</label><div style={{ color: '#fff' }}>{profile.phone}</div></div>
                            <div><label style={{ color: '#888', fontSize: '0.8rem' }}>Location</label><div style={{ color: '#fff' }}>{profile.location}</div></div>
                        </>
                    )}
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                    <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '15px' }}>Security Status</h4>
                    <div style={{ marginBottom: '10px' }}><label style={{ color: '#888', fontSize: '0.8rem' }}>2FA</label><div style={{ color: '#0f0' }}>Enabled</div></div>
                    <div style={{ marginBottom: '10px' }}><label style={{ color: '#888', fontSize: '0.8rem' }}>Last Login</label><div style={{ color: '#fff' }}>Just Now</div></div>
                    <div><label style={{ color: '#888', fontSize: '0.8rem' }}>Password Changed</label><div style={{ color: '#fff' }}>30 days ago</div></div>
                </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                {isEditing ? (
                    <>
                        <button className="btn-neon" style={{ background: '#333', borderColor: '#555' }} onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-neon" onClick={handleSave}>Save Changes</button>
                    </>
                ) : (
                    <button className="btn-neon" onClick={() => setIsEditing(true)} style={{ padding: '10px 30px' }}>Edit Profile</button>
                )}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'escrow':
                return <EscrowDashboard />;
            case 'revenue':
                return <RevenueDashboard />;
            case 'financials':
                return <TaxCompliancePanel />;
            case 'support':
                return <AdminSupportPanel />;
            case 'users':
                return <AdminUserManagement />;
            case 'ai-copilot':
                return <AiAdminCopilotPanel />;
            case 'finances':
                return <AdminInvestmentDashboard />;
            case 'legal':
                return <AdminLegalPanel />;
            case 'settings':
                return <SystemSettingsPanel />;
            case 'tc_editor':
                return <AdminTCEditor />;
            case 'security':
                return <SecuritySettings userId="admin-999" />;
            case 'verification':
                return <AdminVerificationPanel />;
            case 'categories':
                return <AdminCategoryPanel />;
            case 'finance':
                return <FinancialServicesPanel />;
            case 'treasury':
                return <AdminTreasuryPanel />;
            case 'payment_oversight':

                return <AdminFinancialOversight />;
            case 'daily_labor':
                return <AdminLaborPanel />;
            case 'payment_settings':
                return <AdminPaymentSettings />;
            case 'zoom_settings':
                return <AdminZoomSettings />;
            case 'analytics':
                return <AdminAnalyticsPanel />;
            case 'plans':
                return <AdminPlanManager />;
            case 'emergency':
                return <AdminEmergencyPanel />;
            case 'work_permits':
                return <AdminWorkPermitPanel />;
            case 'communication':
                return <AdminCommunicationOverseer />;
            case 'broadcasts':
                return <BroadcastCenter />;
            case 'profile':
                return <AdminProfilePanel />;
            default:

                return <OverviewPanel setActiveTab={setActiveTab} />;
        }
    };

    return (
        <NotificationProvider userId="admin" role="admin">
            <div className="container" style={{ paddingTop: '80px', minHeight: '100vh' }}>
                <NotificationBanner />
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Logo size="2.5rem" />
                        <span className="text-gradient" style={{ fontSize: '1.5rem', borderLeft: '1px solid #333', paddingLeft: '20px', filter: 'grayscale(100%)' }}>Admin Panel</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Super Admin</span>
                        <NotificationBell />
                        <div className="glass-panel" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff' }}></div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 4fr', gap: '30px' }}>
                    <aside className="glass-panel" style={{ height: 'fit-content', minHeight: '80vh', borderRadius: '20px', padding: '20px' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <NavButton tab="overview" activeTab={activeTab} onClick={setActiveTab}>Overview</NavButton>
                            <NavButton tab="escrow" activeTab={activeTab} onClick={setActiveTab}>Escrow System</NavButton>
                            <NavButton tab="revenue" activeTab={activeTab} onClick={setActiveTab}>Revenue Dashboard</NavButton>
                            <NavButton tab="users" activeTab={activeTab} onClick={setActiveTab}>User Management</NavButton>
                            <NavButton tab="financials" activeTab={activeTab} onClick={setActiveTab}>Tax & Financials</NavButton>
                            <NavButton tab="verification" activeTab={activeTab} onClick={setActiveTab}>Verification Requests</NavButton>
                            <NavButton tab="finance" activeTab={activeTab} onClick={setActiveTab}>Financial Division</NavButton>
                            <NavButton tab="treasury" activeTab={activeTab} onClick={setActiveTab}>🏛️ Treasury & Funds</NavButton>
                            <NavButton tab="payment_oversight" activeTab={activeTab} onClick={setActiveTab}>Transactions & Oversight</NavButton>

                            <NavButton tab="daily_labor" activeTab={activeTab} onClick={setActiveTab}>Daily Labor Oversight</NavButton>
                            <NavButton tab="payment_control" activeTab={activeTab} onClick={setActiveTab}>⚠️ Payment Authorization</NavButton>
                            <NavButton tab="payment_settings" activeTab={activeTab} onClick={setActiveTab}>Payment Gateway Portal 🔐</NavButton>
                            <NavButton tab="zoom_settings" activeTab={activeTab} onClick={setActiveTab}>Zoom Meeting Settings 🎥</NavButton>
                            <NavButton tab="work_permits" activeTab={activeTab} onClick={setActiveTab}>Global Work Permits 🛂</NavButton>
                            <NavButton tab="categories" activeTab={activeTab} onClick={setActiveTab}>Skill Categories</NavButton>
                            <NavButton tab="plans" activeTab={activeTab} onClick={setActiveTab}>Subscription Rates 💎</NavButton>
                            <NavButton tab="emergency" activeTab={activeTab} onClick={setActiveTab}>🚨 Emergency Response</NavButton>
                            <NavButton tab="support" activeTab={activeTab} onClick={setActiveTab}>Support Portal</NavButton>

                            <NavButton tab="ai-copilot" activeTab={activeTab} onClick={setActiveTab}>AI Admin Co-Pilot 🤖</NavButton>
                            <NavButton tab="finances" activeTab={activeTab} onClick={setActiveTab}>Financial Dashboard 💰</NavButton>
                            <NavButton tab="analytics" activeTab={activeTab} onClick={setActiveTab}>Advanced Analytics 📊</NavButton>
                            <NavButton tab="communication" activeTab={activeTab} onClick={setActiveTab}>📡 Comms Oversight (Hub)</NavButton>
                            <NavButton tab="broadcasts" activeTab={activeTab} onClick={setActiveTab}>📢 Broadcast Center</NavButton>
                            <NavButton tab="legal" activeTab={activeTab} onClick={setActiveTab}>🛡️ Legal Audit Vault</NavButton>
                            <NavButton tab="security" activeTab={activeTab} onClick={setActiveTab}>🔒 Zero-Trust Security</NavButton>
                            <NavButton tab="settings" activeTab={activeTab} onClick={setActiveTab}>Settings</NavButton>
                            <NavButton tab="tc_editor" activeTab={activeTab} onClick={setActiveTab}>T&C Editor 📝</NavButton>

                            <NavButton tab="profile" activeTab={activeTab} onClick={setActiveTab}>My Profile 👤</NavButton>
                            <Link to="/" style={{ marginTop: '10px', color: 'var(--text-muted)', padding: '15px', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }}>Logout</Link>
                        </nav>
                    </aside>

                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                        <Footer />
                    </main>
                </div>
                <UniversalChat
                    roomId="support-admin-general"
                    userId="admin-999"
                    userName="Admin Super User"
                    userRole="admin"
                    title="Admin Support Chat"
                />
            </div>
        </NotificationProvider>
    );
};

const AdminJobDetailModal = ({ job, onClose }) => {
    if (!job) return null;

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to permanently delete project #${job.id}?`)) {
            fetch(`${API_BASE_URL}/projects/${job.id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(() => {
                    alert('Project deleted successfully.');
                    onClose();
                    // Ideally trigger a refresh of the list here, but for now simple close is fine.
                    // The parent component might need to know to refresh.
                    window.location.reload(); // Simple brute force refresh to show updated list
                })
                .catch(err => {
                    console.error(err);
                    alert('Failed to delete project.');
                });
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', borderRadius: '20px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

                <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>{job.name}</h2>
                <span style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', fontSize: '0.9rem' }}>Project ID: #{job.id}</span>

                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <small style={{ color: 'var(--text-muted)' }}>Status</small>
                        <p>{job.status}</p>
                    </div>
                    <div>
                        <small style={{ color: 'var(--text-muted)' }}>Salary Range</small>
                        <p>${job.details?.salaryMin || 0} - ${job.details?.salaryMax || 0}</p>
                    </div>
                </div>

                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Description</h4>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{job.details?.description || job.description || 'No description available.'}</p>
                </div>

                {job.details && (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {job.details.jobCategory && <span style={{ padding: '5px 15px', background: '#333', borderRadius: '15px', fontSize: '0.8rem' }}>{job.details.jobCategory}</span>}
                            {job.details.jobType && <span style={{ padding: '5px 15px', background: '#333', borderRadius: '15px', fontSize: '0.8rem' }}>{job.details.jobType}</span>}
                            {job.details.workMode && <span style={{ padding: '5px 15px', background: '#333', borderRadius: '15px', fontSize: '0.8rem' }}>{job.details.workMode}</span>}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn-neon" style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>Close</button>
                    <button onClick={handleDelete} className="btn-neon" style={{ background: 'rgba(255,0,0,0.2)', border: '1px solid red', color: 'red' }}>Delete Job</button>
                </div>
            </div>
        </div>
    );
};

const TaxCompliancePanel = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/tax/admin/2025`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    React.useEffect(() => {
        // Fetch initial data on mount
        fetchReport();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Tax Compliance & Reporting (FY 2025)</h2>
                    <button onClick={fetchReport} className="btn-neon" disabled={loading}>
                        {loading ? 'Generating...' : 'Refresh Yearly Report'}
                    </button>
                </div>
                {stats ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <StatCard title="Total System Volume" value={`$${stats.totalSystemVolume.toLocaleString()}`} color="var(--neon-lime)" subtitle="Gross Transaction Value" />
                        <StatCard title="Total Payouts Processed" value={`$${stats.totalPayoutsProcessed.toLocaleString()}`} color="#fff" subtitle="Taxable Worker Income" />
                        <StatCard title="Gross Platform Revenue" value={`$${stats.grossPlatformRevenue.toLocaleString()}`} color="var(--neon-cyan)" subtitle="Net Earnings" />
                    </div>
                ) : (
                    <p>Loading tax data...</p>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3>Recent Tax Filings (Mock)</h3>
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>User</th>
                            <th>Role</th>
                            <th>Tax ID</th>
                            <th>Total Earnings</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style={{ padding: '15px' }}>Alice Dev</td><td>Worker</td><td>***-55-9988</td><td>$15,200</td><td style={{ color: 'var(--neon-lime)' }}>Filed</td><td><button onClick={() => window.open(`${API_BASE_URL}/tax/worker/101/2025`)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}>Download</button></td></tr>
                        <tr><td style={{ padding: '15px' }}>Tech Corp</td><td>Employer</td><td>***-99-1122</td><td>$52,000</td><td style={{ color: 'orange' }}>Pending</td><td><button onClick={() => window.open(`${API_BASE_URL}/tax/employer/202/2025`)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}>Review</button></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const NavButton = ({ tab, activeTab, onClick, children }) => (
    <button
        onClick={() => onClick(tab)}
        style={{
            background: activeTab === tab ? 'linear-gradient(90deg, rgba(80,80,80,0.5), transparent)' : 'transparent',
            border: 'none',
            borderLeft: activeTab === tab ? '4px solid var(--neon-cyan)' : '4px solid transparent',
            color: activeTab === tab ? '#fff' : 'var(--text-muted)',
            padding: '15px 20px',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'var(--font-family)',
            transition: 'all 0.3s'
        }}
    >
        {children}
    </button>
);

const OverviewPanel = ({ setActiveTab }) => {
    const [activities, setActivities] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    React.useEffect(() => {
        // Fetch real projects to populate activity
        fetch(`${API_BASE_URL}/projects`)
            .then(res => res.json())
            .then(data => {
                const projects = Array.isArray(data) ? data : [];
                // Map projects to activity items
                const projectActivities = projects.slice(0, 5).map(p => ({
                    event: 'New Job Posted',
                    user: 'Employer #' + p.employerId,
                    time: 'Recently',
                    status: p.status,
                    data: p,
                    type: 'project'
                }));

                // Mix with some mock system events for variety if needed, or just show projects
                const mockEvents = [
                    { event: 'Funds Deposited', user: 'Sarah J.', time: '15 mins ago', status: 'Escrowed', type: 'system' },
                    { event: 'Dispute Opened', user: 'Project Alpha', time: '1 hr ago', status: 'Action Req', type: 'system' }
                ];

                setActivities([...projectActivities, ...mockEvents]);
            })
            .catch(err => {
                console.error("Dashboard fetch error (using mock):", err);
                setActivities([
                    { event: 'New Job Posted', user: 'Employer #102', time: '5 mins ago', status: 'Active', type: 'project', data: { name: 'Full Stack Dev' } },
                    { event: 'Funds Deposited', user: 'Investor #88', time: '15 mins ago', status: 'Escrowed', type: 'system' },
                    { event: 'Work Permit #55', user: 'Worker #99', time: '1 hr ago', status: 'Pending', type: 'system' }
                ]);
            });
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignContent: 'start' }}>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                <h3>System Status</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <span style={{ padding: '5px 10px', background: 'rgba(0,255,0,0.2)', color: '#0f0', borderRadius: '4px' }}>All Systems Operational</span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px', cursor: 'pointer' }} onClick={() => setActiveTab('escrow')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Escrow Active</h3>
                    <span style={{ color: 'var(--neon-cyan)' }}>View Details →</span>
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>$42,500</p>
                <p style={{ color: 'var(--text-muted)' }}>Currently held in secure vault</p>
            </div>

            {/* Pending Approvals Widget */}
            <PendingApprovalsWidget />

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px', gridColumn: 'span 2' }}>
                <h3>Recent Activity & Oversignt</h3>
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '15px' }}>Event</th>
                            <th>User</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading activity...</td></tr>
                        ) : activities.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px' }}>{item.event} {item.type === 'project' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.data.name})</span>}</td>
                                <td>{item.user}</td>
                                <td>{item.time}</td>
                                <td style={{
                                    color: item.status === 'Active' || item.status === 'pending' ? 'var(--neon-cyan)' :
                                        item.status === 'Escrowed' ? 'var(--neon-lime)' :
                                            item.status === 'Action Req' ? 'var(--neon-pink)' : '#aaa'
                                }}>
                                    {item.status}
                                </td>
                                <td>
                                    {item.type === 'project' && (
                                        <button
                                            onClick={() => setSelectedJob(item.data)}
                                            className="btn-neon"
                                            style={{ padding: '5px 15px', fontSize: '0.8rem' }}
                                        >
                                            View
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedJob && <AdminJobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </div>
    );
};

const EscrowDashboard = () => {
    // Mock Data for Visuals
    const escrowStats = {
        held: 42500,
        released: 128900,
        disputed: 1200,
        commission: 6445 // 5% of released example
    };

    const initialTransactions = [
        { id: "#TRX-9982", desc: "Logo Design Payment - Milestone 1", amount: 500, commission: 50, date: "Dec 14, 10:30 AM", status: "Held" },
        { id: "#TRX-9981", desc: "React App Development", amount: 1200, commission: 120, date: "Dec 14, 09:15 AM", status: "Held" },
        { id: "#TRX-9975", desc: "SEO Optimization", amount: 300, commission: 30, date: "Dec 13, 04:45 PM", status: "Released" },
        { id: "#TRX-9960", desc: "Mobile App UX", amount: 800, commission: 80, date: "Dec 13, 01:20 PM", status: "Dispute" },
        { id: "#TRX-9955", desc: "Content Writing Batch", amount: 150, commission: 15, date: "Dec 13, 11:00 AM", status: "Released" }
    ];

    const [transactions, setTransactions] = useState(initialTransactions);
    const [showFilter, setShowFilter] = useState(false);
    const [filterText, setFilterText] = useState('');

    const handleExportCSV = () => {
        const headers = ["Transaction ID", "Description", "Amount", "Commission", "Date", "Status"];
        const rows = transactions.map(t => [t.id, t.desc, t.amount, t.commission, t.date, t.status]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "escrow_transactions.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    const filteredTransactions = transactions.filter(t =>
        t.desc.toLowerCase().includes(filterText.toLowerCase()) ||
        t.id.toLowerCase().includes(filterText.toLowerCase()) ||
        t.status.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard title="Funds Held (Secure)" value={`$${escrowStats.held.toLocaleString()}`} color="var(--neon-cyan)" />
                <StatCard title="Funds Released" value={`$${escrowStats.released.toLocaleString()}`} color="var(--neon-lime)" />
                <StatCard title="Disputed Amount" value={`$${escrowStats.disputed.toLocaleString()}`} color="var(--neon-pink)" />
                <StatCard title="Platform Commission" value={`$${escrowStats.commission.toLocaleString()}`} color="#ffd700" subtitle="Total Earnings" />
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                    <h3>Transaction History</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-neon" onClick={handleExportCSV} style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Export CSV</button>
                        <button className="btn-neon" onClick={() => setShowFilter(!showFilter)} style={{ padding: '5px 15px', fontSize: '0.8rem' }}>
                            {showFilter ? 'Hide Filter' : 'Filter'}
                        </button>
                    </div>
                </div>

                {showFilter && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginBottom: '20px' }}
                    >
                        <input
                            type="text"
                            placeholder="Filter by description, ID, or status..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--neon-cyan)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontFamily: 'var(--font-family)'
                            }}
                        />
                    </motion.div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '15px' }}>Transaction ID</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Commission (10%)</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t, index) => (
                            <TransactionRow
                                key={index}
                                id={t.id}
                                desc={t.desc}
                                amount={t.amount}
                                commission={t.commission}
                                date={t.date}
                                status={t.status}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                    <h3>Automated Dispute Logic</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px', lineHeight: '1.6' }}>
                        Current configuration releases funds to worker after <b>72 hours</b> of inactivity on review.
                        Disputes trigger an immediate freeze and notify the Neutral Admin (You).
                    </p>
                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '5px' }}>Auto-Release Timer (Hours)</label>
                        <input type="number" defaultValue={72} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '5px' }} />
                        <button className="btn-neon" style={{ marginLeft: '10px', padding: '10px 20px' }}>Update Logic</button>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px', border: '1px solid var(--neon-pink)' }}>
                    <h3 style={{ color: 'var(--neon-pink)' }}>Dispute Resolution Center</h3>
                    <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,0,100,0.1)', borderRadius: '10px' }}>
                        <strong>Active Dispute: #TRX-9960</strong>
                        <p style={{ margin: '5px 0' }}>Employer claims "Work not delivered as per spec". Worker claims "Spec was changed mid-project".</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button style={{ padding: '8px 15px', background: 'var(--neon-pink)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}>Refund Employer</button>
                            <button style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #fff', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}>Release to Worker</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color, subtitle }) => (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', borderTop: `4px solid ${color}` }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</p>
        <h2 style={{ fontSize: '2rem', margin: '10px 0', color: '#fff' }}>{value}</h2>
        {subtitle && <small style={{ color: color }}>{subtitle}</small>}
    </div>
);

const TransactionRow = ({ id, desc, amount, commission, date, status }) => {
    let statusColor = '#fff';
    if (status === 'Held') statusColor = 'var(--neon-cyan)';
    if (status === 'Released') statusColor = 'var(--neon-lime)';
    if (status === 'Dispute') statusColor = 'var(--neon-pink)';

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '15px' }}>{id}</td>
            <td>{desc}</td>
            <td>${amount}</td>
            <td style={{ color: '#ffd700' }}>${commission}</td>
            <td style={{ color: 'var(--text-muted)' }}>{date}</td>
            <td><span style={{ padding: '5px 10px', borderRadius: '4px', background: `${statusColor}20`, color: statusColor, fontSize: '0.85rem' }}>{status}</span></td>
            <td><button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>⋮</button></td>
        </tr>
    );
};

const RevenueDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch live data
    React.useEffect(() => {
        CommissionService.getRecentTransactions()
            .then(data => {
                setTransactions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch revenue data:", err);
                setTransactions([]);
                setLoading(false);
            });
    }, []);

    // 2. Aggregate Totals
    const totals = transactions.reduce((acc, curr) => ({
        volume: acc.volume + (curr.value || 0),
        platformFee: acc.platformFee + (curr.fee || 0),
        adminRevenue: acc.adminRevenue + (curr.admin || 0),
        investorShare: acc.investorShare + (curr.investorPool || 0)
    }), { volume: 0, platformFee: 0, adminRevenue: 0, investorShare: 0 });

    if (loading) return <div className="glass-panel" style={{ padding: '30px' }}>Loading Revenue Data...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Top Level Stats */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', background: 'linear-gradient(to right, rgba(10,10,20,0.9), rgba(30,30,50,0.9))' }}>
                <h2 style={{ marginBottom: '20px' }}>Real-Time Revenue Tracking</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <StatCard title="Total Job Volume" value={`$${totals.volume.toLocaleString()}`} color="#fff" subtitle="Gross Transaction Value" />
                    <StatCard title="Platform Commission (10%)" value={`$${totals.platformFee.toLocaleString()}`} color="var(--neon-purple)" subtitle="Total Fees Collected" />
                    <StatCard title="Net Admin Revenue (70%)" value={`$${totals.adminRevenue.toLocaleString()}`} color="var(--neon-lime)" subtitle="Operating Profit" />
                    <StatCard title="Investor Pool (30%)" value={`$${totals.investorShare.toLocaleString()}`} color="var(--neon-cyan)" subtitle="Distributed Advice" />
                </div>
            </div>

            {/* Detailed Split Visualization */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3>Commission Log</h3>
                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '15px' }}>Job</th>
                                <th>Value</th>
                                <th style={{ color: 'var(--neon-purple)' }}>Fee (10%)</th>
                                <th style={{ color: 'var(--neon-lime)' }}>Admin (70%)</th>
                                <th style={{ color: 'var(--neon-cyan)' }}>Investor (30%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{tx.project}</td>
                                    <td>${tx.value}</td>
                                    <td style={{ color: 'var(--neon-purple)' }}>${tx.fee}</td>
                                    <td style={{ color: 'var(--neon-lime)' }}>${tx.admin}</td>
                                    <td style={{ color: 'var(--neon-cyan)' }}>${tx.investorPool}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3>Escrow Logic Explained</h3>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Trigger</small>
                            <p>Job Marked "Complete"</p>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>↓</div>
                        <div style={{ padding: '15px', background: 'rgba(255,0,255,0.1)', border: '1px solid var(--neon-purple)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--neon-purple)' }}>System Action</small>
                            <p>Deduct 10% Fee</p>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>↓</div>
                        <div style={{ padding: '15px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--neon-lime)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--neon-lime)' }}>Worker Receive</small>
                            <p>90% Net Payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default AdminDashboard;
