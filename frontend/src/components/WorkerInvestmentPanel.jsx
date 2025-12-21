
import React, { useState, useEffect } from 'react';

const WorkerInvestmentPanel = ({ workerId = "101" }) => {
    const [proposals, setProposals] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        roi: '',
        pitchDeckUrl: '',
        executiveSummary: '',
        fundAllocation: '',
        projectedRoiTimeline: '',
        investorProfitSharePercentage: '',
        mediaUrls: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            const res = await fetch(`http://localhost:3001/investment/worker/${workerId}`);
            setProposals(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const res = await fetch('http://localhost:3001/investment/proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, workerId: String(workerId) })
            });
            if (!res.ok) throw new Error('Failed to create proposal');

            setLoading(false);
            setFormData({ title: '', description: '', budget: '', roi: '', pitchDeckUrl: '' });
            fetchProposals();
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };

    return (
        <div style={{ color: '#fff', padding: '20px' }}>
            <h2 className="text-gradient">🚀 Entrepreneur Investment Hub</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>

                {/* Proposal Form */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Create Investment Proposal</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Standardized Upload Template */}
                        <h4 style={{ color: 'cyan', marginTop: '0' }}>1. Project Essentials</h4>
                        <input className="neon-input" placeholder="Project Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', marginBottom: '10px' }} required />

                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Executive Summary & Goal</label>
                        <textarea className="neon-input" placeholder="Concise summary of project goals and value proposition..." value={formData.executiveSummary || ''} onChange={e => setFormData({ ...formData, executiveSummary: e.target.value })} style={{ width: '100%', marginBottom: '10px', height: '80px' }} required />

                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Full Description</label>
                        <textarea className="neon-input" placeholder="Deep dive into the project details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', marginBottom: '10px', height: '100px' }} required />

                        <h4 style={{ color: 'cyan' }}>2. Financials & Offers</h4>
                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Detailed Fund Allocation (Budgeting)</label>
                        <textarea className="neon-input" placeholder="e.g., 30% Dev, 20% Marketing, 50% Operations..." value={formData.fundAllocation || ''} onChange={e => setFormData({ ...formData, fundAllocation: e.target.value })} style={{ width: '100%', marginBottom: '10px', height: '60px' }} required />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Total Budget ($)</label>
                                <input type="number" className="neon-input" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Projected ROI (%)</label>
                                <input type="number" className="neon-input" value={formData.roi} onChange={e => setFormData({ ...formData, roi: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Investor Profit Share (%)</label>
                                <input type="number" className="neon-input" value={formData.investorProfitSharePercentage || ''} onChange={e => setFormData({ ...formData, investorProfitSharePercentage: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Projected Timeline</label>
                                <input type="text" className="neon-input" placeholder="e.g. 6 Months" value={formData.projectedRoiTimeline || ''} onChange={e => setFormData({ ...formData, projectedRoiTimeline: e.target.value })} style={{ width: '100%' }} required />
                            </div>
                        </div>

                        {/* Auto-Calculation Preview */}
                        {(formData.budget && formData.investorProfitSharePercentage) && (
                            <div style={{ background: 'rgba(0, 255, 255, 0.1)', padding: '10px', borderRadius: '5px', marginTop: '10px', border: '1px solid cyan' }}>
                                <small style={{ color: 'cyan', display: 'block', marginBottom: '5px' }}>💰 Financial Preview</small>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Total Ask: <b>${Number(formData.budget).toLocaleString()}</b></span>
                                    <span>Investor Equity: <b>{formData.investorProfitSharePercentage}%</b></span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>
                                    <i>* Admin Commission (10%) automatically deducted from profits. Net Investor Profit calculated post-commission.</i>
                                </div>
                            </div>
                        )}

                        <h4 style={{ color: 'cyan' }}>3. Media & Docs</h4>
                        <input className="neon-input" placeholder="Pitch Deck URL (Before: Drive/Dropbox)" value={formData.pitchDeckUrl} onChange={e => setFormData({ ...formData, pitchDeckUrl: e.target.value })} style={{ width: '100%', marginBottom: '10px' }} />
                        <input className="neon-input" placeholder="Demo Video / Prototype Image URL" value={formData.mediaUrls ? formData.mediaUrls[0] : ''} onChange={e => setFormData({ ...formData, mediaUrls: [e.target.value] })} style={{ width: '100%', marginBottom: '15px' }} />

                        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#aaa' }}>
                            <input type="checkbox" checked={true} readOnly />
                            <span>I agree to the <b>Liability Disclaimer</b> & Standard Project Terms.</span>
                        </div>

                        <button className="btn-neon" type="submit" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Submitting...' : '🚀 Submit Professional Proposal'}
                        </button>
                    </form>
                </div>

                {/* Capital Tracker */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>My Capital Tracker</h3>
                    {proposals.length === 0 ? <p style={{ color: '#888' }}>No active proposals.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {proposals.map(p => (
                                <div key={p.id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <b style={{ color: 'cyan' }}>{p.title}</b>
                                            <div style={{ fontSize: '0.7rem', color: '#888' }}>AI Risk Assessment: <span style={{ color: p.riskScore > 50 ? 'red' : '#0f0' }}>{p.riskScore}/100</span></div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '5px', background: p.status === 'FUNDED' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,0,0.2)', color: p.status === 'FUNDED' ? '#0f0' : 'yellow' }}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '5px 0' }}>{p.description}</p>

                                    {/* Milestones & Funding */}
                                    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Funding Milestones</div>
                                        {p.milestones && p.milestones.map(m => (
                                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px', color: m.status === 'RELEASED' ? '#fff' : '#666' }}>
                                                <span>{m.status === 'RELEASED' ? '🔓' : '🔒'} {m.title}</span>
                                                <span>${m.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                                            <span>Raised: ${p.raisedAmount}</span>
                                            <span>Goal: ${p.budget}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${Math.min((p.raisedAmount / p.budget) * 100, 100)}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, cyan, blue)',
                                                transition: 'width 0.5s'
                                            }}></div>
                                        </div>
                                    </div>

                                    {p.status === 'FUNDED' && (
                                        <button style={{ marginTop: '10px', background: '#333', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                            + Post Project Update
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default WorkerInvestmentPanel;
