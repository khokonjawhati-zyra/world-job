
import React, { useState, useEffect } from 'react';

const AdminAnalyticsPanel = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [fraudAlerts, setFraudAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [heatmapRes, fraudRes] = await Promise.all([
                    fetch('http://localhost:3001/analytics/heatmap'),
                    fetch('http://localhost:3001/analytics/fraud-alerts')
                ]);

                const heatmap = await heatmapRes.json();
                const alerts = await fraudRes.json();

                if (Array.isArray(heatmap)) setHeatmapData(heatmap);
                if (Array.isArray(alerts)) setFraudAlerts(alerts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div style={{ display: 'grid', gap: '30px' }}>
            {/* Heatmap Section */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>📊 Area Demand Heatmap</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {heatmapData.map((data, idx) => (
                        <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
                                background: `linear-gradient(90deg, transparent, ${data.demandScore > 80 ? 'var(--neon-pink)' : data.demandScore > 60 ? 'orange' : 'var(--neon-lime)'})`
                            }}></div>
                            <h4>{data.location}</h4>
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                    <span>Demand Score:</span>
                                    <span style={{ color: data.demandScore > 80 ? 'var(--neon-pink)' : 'var(--neon-lime)' }}>{data.demandScore}/100</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                    <span>Active Jobs:</span>
                                    <span>{data.activeJobs}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Supply:</span>
                                    <span style={{ color: data.workerSupply === 'Low' ? 'orange' : 'var(--text-muted)' }}>{data.workerSupply}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fraud Prediction Section */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255, 0, 0, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: 'var(--neon-pink)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🚨 AI Fraud Prediction System
                    </h2>
                    <span style={{ fontSize: '0.9rem', padding: '5px 10px', background: 'rgba(255,0,0,0.1)', borderRadius: '5px', color: 'var(--neon-pink)' }}>
                        Live Monitoring
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '15px' }}>Alert ID</th>
                            <th>Entity</th>
                            <th>Type</th>
                            <th>Risk Score</th>
                            <th>AI Reason</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fraudAlerts.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No active alerts.</td></tr> :
                            fraudAlerts.map(alert => (
                                <tr key={alert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{alert.id}</td>
                                    <td>{alert.user}</td>
                                    <td><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>{alert.type}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '50px', height: '6px', background: '#333', borderRadius: '3px' }}>
                                                <div style={{ width: `${alert.riskScore}%`, height: '100%', background: alert.riskScore > 80 ? 'red' : 'orange', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontWeight: 'bold', color: alert.riskScore > 80 ? 'red' : 'orange' }}>{alert.riskScore}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{alert.reason}</td>
                                    <td><span style={{ color: alert.status === 'Active' ? 'red' : 'orange' }}>{alert.status}</span></td>
                                    <td>
                                        <button className="btn-neon" style={{ fontSize: '0.8rem', padding: '5px 10px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: 'red' }}>
                                            Investigate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAnalyticsPanel;
