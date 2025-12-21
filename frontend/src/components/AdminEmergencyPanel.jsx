import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminEmergencyPanel = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAlert, setNewAlert] = useState({ title: '', location: '', severity: 'High', requiredSkills: '' });
    const [trackingData, setTrackingData] = useState([]);

    useEffect(() => {
        fetchEmergencies();
        fetchTracking();
    }, []);

    const fetchEmergencies = () => {
        fetch('https://world-job-backend.vercel.app/emergency/active')
            .then(res => res.json())
            .then(data => {
                setEmergencies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchTracking = () => {
        fetch('https://world-job-backend.vercel.app/emergency/tracking')
            .then(res => res.json())
            .then(data => setTrackingData(data))
            .catch(console.error);
    };

    const handleCreateAlert = () => {
        fetch('https://world-job-backend.vercel.app/emergency/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newAlert,
                requiredSkills: newAlert.requiredSkills.split(',').map(s => s.trim())
            })
        })
            .then(res => res.json())
            .then(data => {
                alert('Emergency Alert Broadcasted!');
                setEmergencies([...emergencies, data]);
                setNewAlert({ title: '', location: '', severity: 'High', requiredSkills: '' });
            })
            .catch(err => alert('Failed to create alert'));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header Stats */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', background: 'linear-gradient(to right, #2c0000, #400000)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🚨 Disaster & Emergency Response Mode
                        </h2>
                        <p style={{ color: '#ffaaaa', marginTop: '5px' }}>
                            Rapidly mobilize verified workers for critical situations.
                        </p>
                    </div>
                    <button className="btn-neon" style={{ background: 'red', color: 'white', border: 'none' }} onClick={() => window.location.reload()}>
                        FORCE REFRESH METRICS
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Active Emergencies */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Active Emergency Deployments</h3>
                    {loading ? <p>Loading...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#aaa' }}>
                                    <th style={{ padding: '10px' }}>Title</th>
                                    <th>Location</th>
                                    <th>Severity</th>
                                    <th>Deployed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emergencies.map(e => (
                                    <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>{e.title}</td>
                                        <td>{e.location}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px',
                                                background: e.severity === 'Critical' ? 'red' : 'orange',
                                                color: '#fff', fontSize: '0.8rem'
                                            }}>
                                                {e.severity}
                                            </span>
                                        </td>
                                        <td>{e.deployedWorkers} Workers</td>
                                        <td style={{ color: '#0f0' }}>{e.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Create Alert */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid #ff4d4d' }}>
                    <h3 style={{ color: '#ff4d4d', marginBottom: '20px' }}>Broadcast New Alert</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            placeholder="Emergency Title (e.g. Earthquake Response)"
                            value={newAlert.title}
                            onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            placeholder="Location"
                            value={newAlert.location}
                            onChange={e => setNewAlert({ ...newAlert, location: e.target.value })}
                            style={inputStyle}
                        />
                        <select
                            value={newAlert.severity}
                            onChange={e => setNewAlert({ ...newAlert, severity: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="High">High Priority</option>
                            <option value="Critical">Critical (Life Safety)</option>
                        </select>
                        <input
                            placeholder="Req. Skills (comma sep)"
                            value={newAlert.requiredSkills}
                            onChange={e => setNewAlert({ ...newAlert, requiredSkills: e.target.value })}
                            style={inputStyle}
                        />
                        <button onClick={handleCreateAlert} className="btn-neon" style={{ background: '#ff4d4d', color: 'white', marginTop: '10px' }}>
                            BROADCAST ALERT 📢
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Map Placeholder & Agency Coordination */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Real-Time Workforce Tracking (GPS)</h3>
                    <div style={{ width: '100%', height: '300px', background: '#111', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                        {/* Mock Map Visual */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>
                        {trackingData.map(w => (
                            <motion.div
                                key={w.workerId}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    left: `${(w.lng + 118.25) * 1000}%`, // Fake projection
                                    top: `${(w.lat - 34.05) * 1000}%`,
                                    width: '10px', height: '10px', background: '#0f0', borderRadius: '50%',
                                    boxShadow: '0 0 10px #0f0'
                                }}
                                title={`Worker #${w.workerId}: ${w.status}`}
                            />
                        ))}
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#aaa', fontSize: '0.8rem' }}>
                            * Live GPS Mock View
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Multi-Agency Coordination</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['Red Cross', 'FEMA', 'Local Fire Dept', 'Medical Corps'].map(agency => (
                            <div key={agency} style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {agency} <span style={{ color: '#0f0', marginLeft: '5px' }}>● Online</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4 style={{ marginBottom: '10px' }}>Resource Requests</h4>
                        <div style={{ padding: '10px', background: 'rgba(255,100,0,0.1)', borderRadius: '5px', marginBottom: '5px' }}>
                            <strong>Request #991:</strong> Setup Triage Tent - 5 Workers Needed
                            <button style={{ float: 'right', background: 'none', border: '1px solid orange', color: 'orange', borderRadius: '4px', cursor: 'pointer' }}>Assign</button>
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(255,100,0,0.1)', borderRadius: '5px' }}>
                            <strong>Request #992:</strong> Water Distribution - 10 Workers Needed
                            <button style={{ float: 'right', background: 'none', border: '1px solid orange', color: 'orange', borderRadius: '4px', cursor: 'pointer' }}>Assign</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)',
    border: '1px solid #444', borderRadius: '8px', color: '#fff'
};

export default AdminEmergencyPanel;
