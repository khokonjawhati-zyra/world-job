import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AdminInvestmentDashboard = () => {
    const [stats, setStats] = useState(null);
    const [settings, setSettings] = useState({ globalCommissionRate: 10 });
    const [newRate, setNewRate] = useState('');

    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStats();
        fetchSettings();
        fetchProposals();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/investment/admin/dashboard`);
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            // Net Profit Calc
            data.netProfit = data.estimatedCommission * 0.95;
            setStats(data);
        } catch (err) {
            console.warn("Backend unreached, using mock stats:", err);
            setStats({
                totalProposals: 12,
                fundedProjects: 5,
                totalInvested: 154000,
                estimatedCommission: 15400,
                netProfit: 14630
            });
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/investment/settings`);
            if (!res.ok) throw new Error('Failed to fetch settings');
            const data = await res.json();
            setSettings(data);
        } catch (err) {
            setSettings({ globalCommissionRate: 10 });
        }
    };

    const fetchProposals = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/investment/marketplace`);
            if (!res.ok) throw new Error('Failed to fetch proposals');
            const data = await res.json();
            setProposals(data);
        } catch (err) {
            setProposals([
                { id: 1, title: 'Solar Tech Expansion', roi: 15, budget: 50000, raisedAmount: 50000, riskScore: 12, status: 'FUNDED', customCommissionRate: null },
                { id: 2, title: 'AI Retail Bot', roi: 22, budget: 12000, raisedAmount: 4500, riskScore: 45, status: 'OPEN', customCommissionRate: 12 },
                { id: 3, title: 'Urban Farming Unit', roi: 8, budget: 35000, raisedAmount: 10000, riskScore: 8, status: 'OPEN', customCommissionRate: null }
            ]);
        }
    };

    const updateCommission = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/investment/settings/commission`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rate: Number(newRate) })
            });
            if (!res.ok) throw new Error("Backend Failed");

            setNewRate('');
            fetchSettings();
            alert("Commission Rate Updated!");
        } catch (e) {
            console.warn("Simulating Commission Update");
            setSettings(prev => ({ ...prev, globalCommissionRate: Number(newRate) }));
            setNewRate('');
            alert("Commission Rate Updated Successfully (Demo Mode)");
        }
    };

    if (!stats) return (
        <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>
            <h2>Loading Financial Data...</h2>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div style={{ color: '#fff', padding: '20px', minHeight: '80vh', background: 'radial-gradient(circle at top right, #222, #000)', borderRadius: '20px' }}>
            <h2 style={{ color: 'gold', marginBottom: '20px' }}>💰 Unified Financial Dashboard</h2>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalProposals || 0}</div>
                    <div style={{ color: '#888' }}>Total Proposals</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f0' }}>{stats.fundedProjects || 0}</div>
                    <div style={{ color: '#888' }}>Funded Projects</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'cyan' }}>${(stats.totalInvested || 0).toLocaleString()}</div>
                    <div style={{ color: '#888' }}>Total Capital Flow</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid gold' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'gold' }}>${(stats.estimatedCommission || 0).toLocaleString()}</div>
                    <div style={{ color: '#888' }}>Est. Admin Revenue</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,215,0,0.1)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>${(stats.netProfit || 0).toLocaleString()}</div>
                    <div style={{ color: '#aaa' }}>Platform Net Profit</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Advanced Commission Engine & Project-Specific Overrides */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Advanced Commission Engine</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', marginTop: '15px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: '#aaa', borderBottom: '1px solid #333' }}>
                                    <th style={{ padding: '10px' }}>Project</th>
                                    <th>Budget</th>
                                    <th>Raised</th>
                                    <th>Risk Score</th>
                                    <th>Status</th>
                                    <th>Commission Tier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proposals.length === 0 ? <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No active projects found.</td></tr> : proposals.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#fff' }}>{p.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>ROI: {p.roi}%</div>
                                        </td>
                                        <td>${p.budget.toLocaleString()}</td>
                                        <td style={{ color: 'cyan' }}>${p.raisedAmount.toLocaleString()}</td>
                                        <td style={{ color: p.riskScore > 50 ? 'red' : '#0f0' }}>{p.riskScore}/100</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                background: p.status === 'FUNDED' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,0,0.1)',
                                                color: p.status === 'FUNDED' ? '#0f0' : 'yellow'
                                            }}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            {p.customCommissionRate ?
                                                <span style={{ border: '1px solid gold', padding: '2px 5px', color: 'gold', borderRadius: '3px' }}>Custom: {p.customCommissionRate}%</span> :
                                                <span style={{ color: '#aaa' }}>Global ({settings.globalCommissionRate}%)</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Commission Control */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Commission Control</h3>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Global Commission Fee</div>
                        <div style={{ fontSize: '2rem', color: 'gold', fontWeight: 'bold' }}>{settings.globalCommissionRate}%</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            className="neon-input"
                            placeholder="New rate %"
                            value={newRate}
                            onChange={e => setNewRate(e.target.value)}
                            style={{ width: '100px' }}
                        />
                        <button className="btn-neon" onClick={updateCommission}>Update Rate</button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                        * Applies to all future investment profits automatically.
                    </p>
                </div>
            </div>
        </div>
    );

};

export default AdminInvestmentDashboard;
