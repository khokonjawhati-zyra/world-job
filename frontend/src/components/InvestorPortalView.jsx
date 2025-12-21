
import React, { useState, useEffect } from 'react';
import { CommissionService } from '../services/CommissionService';

const InvestorPortalView = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalVolume: 8700,
        totalFees: 870,
        adminRevenue: 609,
        investorPool: 261
    });

    const [myPortfolio, setMyPortfolio] = useState({
        sharesOwned: 500,
        totalShares: 10000,
        investedAmount: 5000,
        totalDividends: 345.50
    });

    const [transactions, setTransactions] = useState([]);
    const [pitches, setPitches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Investor Data
                const investorData = await CommissionService.getInvestor('1');
                if (investorData) {
                    setMyPortfolio({
                        sharesOwned: investorData.shares,
                        totalShares: 10000,
                        investedAmount: 5000,
                        totalDividends: investorData.totalDividends
                    });
                }

                // 2. Fetch Transactions
                const recent = await CommissionService.getRecentTransactions();
                setTransactions(recent);

                // 3. Fetch Pitches
                const pitchData = await CommissionService.getPitches();
                setPitches(pitchData);

                // 4. Calculate Stats
                const newStats = recent.reduce((acc, curr) => ({
                    totalVolume: acc.totalVolume + curr.value,
                    totalFees: acc.totalFees + curr.fee,
                    adminRevenue: acc.adminRevenue + curr.admin,
                    investorPool: acc.investorPool + curr.investorPool
                }), { totalVolume: 0, totalFees: 0, adminRevenue: 0, investorPool: 0 });

                setStats(newStats);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleFundProject = async (id) => {
        try {
            await CommissionService.fundProject(id, 1000);
            alert("Successfully funded $1,000 to the project!");
        } catch (e) {
            alert("Funding failed.");
        }
    };

    const simulateNewJob = async () => {
        try {
            await CommissionService.completeProject('104');
            alert("New Project Completed! Dividends distributed.");
        } catch (e) {
            alert("Error completing project");
        }
    };

    const myDailyDividend = CommissionService.calculateDividend(stats.investorPool, myPortfolio.sharesOwned, myPortfolio.totalShares);

    const renderContent = () => {
        switch (activeTab) {
            case 'portfolio':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>My Investment Portfolio</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Shares Owned</p>
                                <h3 style={{ fontSize: '2rem', color: '#fff' }}>{myPortfolio.sharesOwned} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {myPortfolio.totalShares.toLocaleString()}</span></h3>
                                <p style={{ color: 'var(--neon-lime)', fontSize: '0.9rem' }}>5.0% Ownership</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Invested Capital</p>
                                <h3 style={{ fontSize: '2rem', color: 'var(--neon-cyan)' }}>${myPortfolio.investedAmount.toLocaleString()}</h3>
                                <p style={{ color: 'var(--neon-lime)', fontSize: '0.9rem' }}>ROI: {((myPortfolio.totalDividends / myPortfolio.investedAmount) * 100).toFixed(1)}%</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Lifetime Dividends</p>
                                <h3 style={{ fontSize: '2rem', color: 'var(--neon-pink)' }}>${myPortfolio.totalDividends.toFixed(2)}</h3>
                            </div>
                        </div>
                        <div style={{ marginTop: '30px' }}>
                            <button className="btn-neon">Invest More Shares</button>
                            <button className="btn-neon" style={{ marginLeft: '15px', borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>Withdraw Dividends</button>
                            <button onClick={simulateNewJob} className="btn-neon" style={{ marginLeft: '15px', borderColor: 'var(--neon-lime)', color: 'var(--neon-lime)' }}>Simulate Job Complete</button>
                        </div>
                    </div>
                );
            case 'pitch':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Investment Opportunities</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Fund high-potential projects and earn pre-defined dividends.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            {pitches.map(pitch => (
                                <div key={pitch.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{pitch.name}</h3>
                                        <span className="badge" style={{ background: 'var(--neon-purple)', color: '#000', padding: '2px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>Seed Round</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{pitch.description}</p>

                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Raised</span>
                                            <span style={{ color: 'var(--neon-cyan)' }}>${(pitch.raisedAmount || 0).toLocaleString()} / ${pitch.fundingGoal.toLocaleString()}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${((pitch.raisedAmount || 0) / pitch.fundingGoal) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleFundProject(pitch.id)} className="btn-neon" style={{ flex: 1, fontSize: '0.9rem' }}>Fund $1,000</button>
                                        <button className="btn-neon" style={{ flex: 1, fontSize: '0.9rem', borderColor: '#333', color: '#ccc' }}>Details</button>
                                    </div>
                                </div>
                            ))}
                            {pitches.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No active startup pitches available at the moment.</p>}
                        </div>
                    </div>
                );
            case 'market':
                return (
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h2>Live Market Stats</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time platform activity contributing to the divident pool.</p>

                        <div style={{ marginTop: '20px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>Project</th>
                                        <th style={{ padding: '10px' }}>Value</th>
                                        <th style={{ padding: '10px', color: 'var(--neon-purple)' }}>Platform Fee (10%)</th>
                                        <th style={{ padding: '10px', color: 'var(--neon-cyan)' }}>Investor Pool (30%)</th>
                                        <th style={{ padding: '10px' }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px 10px', color: '#fff' }}>{tx.project}</td>
                                            <td style={{ padding: '15px 10px' }}>${tx.value}</td>
                                            <td style={{ padding: '15px 10px', color: 'var(--neon-purple)' }}>+${tx.fee}</td>
                                            <td style={{ padding: '15px 10px', color: 'var(--neon-cyan)' }}>+${tx.investorPool}</td>
                                            <td style={{ padding: '15px 10px', fontSize: '0.8rem' }}>{tx.date.split('T')[1]?.substring(0, 5) || tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <>
                        <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(157,0,255,0.1))' }}>
                            <h2 style={{ marginBottom: '10px' }}>Welcome, Early Investor</h2>
                            <p style={{ color: 'var(--text-muted)' }}>You are earning passive income from every job completed on World Job Market.</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '40px' }}>
                                <div>
                                    <h1 style={{ fontSize: '3.5rem', color: 'var(--neon-cyan)', marginBottom: '5px' }}>${myDailyDividend.toFixed(2)}</h1>
                                    <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Today's Dividend Share</p>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--glass-border)' }}></div>
                                <div>
                                    <h1 style={{ fontSize: '3.5rem', color: '#fff', marginBottom: '5px' }}>${stats.investorPool.toLocaleString()}</h1>
                                    <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Total Global Pool (Today)</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px' }}>
                                <h3>Commission Structure</h3>
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Platform Fee</span>
                                        <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>10% of Job Value</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--glass-border)' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '15px' }}>
                                        <span>↳ Admin Revenue</span>
                                        <span style={{ color: 'var(--text-muted)' }}>70% of Fee</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '15px' }}>
                                        <span>↳ Investor Pool</span>
                                        <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>30% of Fee</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px' }}>
                                <h3>Market Sentiment</h3>
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '10px solid var(--neon-lime)', borderBottomColor: 'transparent', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Bullish</span>
                                    </div>
                                    <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>High job volume today.</p>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div>
            {/* Internal Navigation Tabs for Investor Portal */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--glass-border)' }}>
                {['overview', 'pitch', 'portfolio', 'market'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: activeTab === tab ? 'var(--neon-cyan)' : 'var(--text-muted)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderBottom: activeTab === tab ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'pitch' ? 'Pitch Deck & Funding' : tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

export default InvestorPortalView;
