import React, { useState } from 'react';
import ChatWidget from '../components/ChatWidget';
import InvestorMarketplace from '../components/InvestorMarketplace';
import InvestorPortfolio from '../components/InvestorPortfolio';
import InvestorProfile from '../components/InvestorProfile';
import SecuritySettings from '../components/SecuritySettings';
import Footer from '../components/Footer';
import FinancialsPanel from '../components/FinancialsPanel';
import ReferralDashboard from '../components/ReferralDashboard';
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
                <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                    <h1>⚠️ Something went wrong.</h1>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>Reload Page</button>
                </div>
            );
        }
        return this.props.children;
    }
}

const InvestorDashboard = () => {
    const [activeTab, setActiveTab] = useState('marketplace');
    const [walletBalance, setWalletBalance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWalletBalance = () => {
        setRefreshing(true);
        fetch('https://world-job-backend.vercel.app/payment/balance/901')
            .then(res => res.json())
            .then(data => setWalletBalance(data.balance || 0))
            .catch(console.error)
            .finally(() => setTimeout(() => setRefreshing(false), 500));
    };

    React.useEffect(() => {
        fetchWalletBalance();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'marketplace':
                return <InvestorMarketplace investorId="901" />;
            case 'portfolio':
                return <InvestorPortfolio investorId="901" />;
            case 'profile':
                return <InvestorProfile investorId="901" />;
            case 'security':
                return <SecuritySettings userId="901" />;
            case 'financials':
                return (
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h2>Financials & Wallet</h2>
                        <FinancialsPanel userId="901" role="investor" onBalanceUpdate={fetchWalletBalance} />
                    </div>
                );
            case 'referral':
                return (
                    <ReferralDashboard
                        user={{
                            referralCode: 'INVESTOR-901',
                            referralEarnings: 5000,
                            referralCount: 7
                        }}
                    />
                );
            case 'settings':
                return <div className="glass-panel" style={{ padding: '20px' }}><h2>Settings (Coming Soon)</h2></div>;
            default:
                return <div>Select an option</div>;
        }
    };

    const navItemStyle = (isActive) => ({
        padding: '10px 15px',
        marginBottom: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
        color: isActive ? 'cyan' : '#888',
        border: isActive ? '1px solid cyan' : '1px solid transparent',
        transition: 'all 0.3s'
    });

    return (
        <ErrorBoundary>
            <NotificationProvider userId="901" role="investor">
                <div style={{ display: 'flex', minHeight: '100vh', background: '#050510', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                    {/* Sidebar */}
                    <div style={{ width: '250px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid #333', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 className="text-gradient" style={{ margin: 0 }}>W🌎RLD J🌎B <span style={{ fontSize: '0.5em', border: '1px solid cyan', padding: '2px 5px', borderRadius: '3px' }}>INV</span></h2>
                            <NotificationBell />
                        </div>

                        {/* Wallet Widget in Sidebar */}
                        <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px', borderRadius: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--neon-cyan)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>Wallet Balance</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--neon-cyan)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                ${walletBalance.toLocaleString()}
                                <button
                                    onClick={fetchWalletBalance}
                                    style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', transform: refreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s' }}
                                >
                                    ↻
                                </button>
                            </div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li onClick={() => setActiveTab('marketplace')} style={navItemStyle(activeTab === 'marketplace')}>💎 Marketplace</li>
                            <li onClick={() => setActiveTab('portfolio')} style={navItemStyle(activeTab === 'portfolio')}>📈 Portfolio</li>
                            <li onClick={() => setActiveTab('profile')} style={navItemStyle(activeTab === 'profile')}>👤 Profile</li>
                            <li onClick={() => setActiveTab('financials')} style={navItemStyle(activeTab === 'financials')}>💰 Financials & Wallet</li>
                            <li onClick={() => setActiveTab('referral')} style={navItemStyle(activeTab === 'referral')}>🎁 Refer & Earn</li>
                            <li onClick={() => setActiveTab('security')} style={navItemStyle(activeTab === 'security')}>🛡️ Security Center</li>
                            <li onClick={() => setActiveTab('settings')} style={navItemStyle(activeTab === 'settings')}>⚙️ Settings</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                        <NotificationBanner />
                        {renderContent()}
                        <Footer />
                    </div>

                    <ChatWidget />
                </div>
            </NotificationProvider>
        </ErrorBoundary>
    );
};

export default InvestorDashboard;
