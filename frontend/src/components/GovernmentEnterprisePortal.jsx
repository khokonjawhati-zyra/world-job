import React, { useState } from 'react';

const GovernmentEnterprisePortal = () => {
    const [mode, setMode] = useState('GOVERNMENT'); // GOVERNMENT or ENTERPRISE
    const [programs, setPrograms] = useState([
        { name: 'National Highway Expansion', location: 'Region A', workers: 450, status: 'Active' },
        { name: 'City Metro Infrastructure', location: 'Urban Center', workers: 300, status: 'Hiring' },
        { name: 'Rural Sanitation Initiative', location: 'Region B', workers: 120, status: 'Active' },
        { name: 'Green Energy Plant Construction', location: 'Coastal Zone', workers: 0, status: 'Planning' }
    ]);

    const [showProgramModal, setShowProgramModal] = useState(false);
    const [editingProgramIndex, setEditingProgramIndex] = useState(null);
    const [programFormData, setProgramFormData] = useState({ name: '', location: '', status: 'Planning', workers: 0 });
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkRequest, setBulkRequest] = useState({ campaign: '', role: '', count: '' });

    const handleBulkSubmit = () => {
        if (!bulkRequest.campaign || !bulkRequest.role) return;
        alert(`Bulk Request "${bulkRequest.campaign}" for ${bulkRequest.count} ${bulkRequest.role}s submitted!`);
        setShowBulkModal(false);
        setBulkRequest({ campaign: '', role: '', count: '' });
    };

    const handleOpenModal = (index = null) => {
        if (index !== null) {
            setEditingProgramIndex(index);
            setProgramFormData(programs[index]);
        } else {
            setEditingProgramIndex(null);
            setProgramFormData({ name: '', location: '', status: 'Planning', workers: 0 });
        }
        setShowProgramModal(true);
    };

    const handleSaveProgram = () => {
        if (!programFormData.name) return;

        if (editingProgramIndex !== null) {
            // Edit existing
            const updatedPrograms = [...programs];
            updatedPrograms[editingProgramIndex] = { ...programFormData };
            setPrograms(updatedPrograms);
            alert(`Program "${programFormData.name}" updated!`);
        } else {
            // Create new
            setPrograms([{
                name: programFormData.name,
                location: programFormData.location || 'National',
                workers: 0,
                status: 'Planning'
            }, ...programs]);
            alert(`Program "${programFormData.name}" initialized successfully!`);
        }

        setShowProgramModal(false);
        setProgramFormData({ name: '', location: '', status: 'Planning', workers: 0 });
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button
                    onClick={() => setMode('GOVERNMENT')}
                    className="btn-neon"
                    style={{
                        flex: 1,
                        background: mode === 'GOVERNMENT' ? 'var(--neon-cyan)' : 'transparent',
                        color: mode === 'GOVERNMENT' ? '#000' : 'var(--neon-cyan)',
                        fontSize: '1.2rem'
                    }}
                >
                    🏛️ Government Job Programs
                </button>
                <button
                    onClick={() => setMode('ENTERPRISE')}
                    className="btn-neon"
                    style={{
                        flex: 1,
                        background: mode === 'ENTERPRISE' ? 'var(--neon-purple)' : 'transparent',
                        color: mode === 'ENTERPRISE' ? '#fff' : 'var(--neon-purple)',
                        fontSize: '1.2rem',
                        borderColor: 'var(--neon-purple)'
                    }}
                >
                    🏢 Enterprise Hiring Dashboard
                </button>
            </div>

            {mode === 'GOVERNMENT' ? (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid var(--neon-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ color: 'var(--neon-cyan)' }}>Public-Sector & Infrastructure</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Manage large-scale national employment initiatives.</p>
                        </div>
                        <button
                            className="btn-neon"
                            style={{ background: 'var(--neon-cyan)', color: '#000', cursor: 'pointer' }}
                            onClick={() => handleOpenModal(null)}
                        >
                            + Launch New Program
                        </button>
                    </div>

                    {/* Program Management Modal */}
                    {showProgramModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}>
                            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', width: '400px', border: '1px solid var(--neon-cyan)' }}>
                                <h3 style={{ marginTop: 0, color: 'var(--neon-cyan)' }}>
                                    {editingProgramIndex !== null ? '⚙️ Configure Program' : '🚀 Launch New Initiative'}
                                </h3>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Program Name</label>
                                    <input
                                        type="text"
                                        value={programFormData.name}
                                        onChange={(e) => setProgramFormData({ ...programFormData, name: e.target.value })}
                                        placeholder="e.g. Clean Water Expansion"
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Target Region</label>
                                    <input
                                        type="text"
                                        value={programFormData.location}
                                        onChange={(e) => setProgramFormData({ ...programFormData, location: e.target.value })}
                                        placeholder="e.g. North Province"
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                </div>
                                {editingProgramIndex !== null && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Status</label>
                                        <select
                                            value={programFormData.status}
                                            onChange={(e) => setProgramFormData({ ...programFormData, status: e.target.value })}
                                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                        >
                                            <option value="Active" style={{ backgroundColor: '#000' }}>Active</option>
                                            <option value="Hiring" style={{ backgroundColor: '#000' }}>Hiring</option>
                                            <option value="Planning" style={{ backgroundColor: '#000' }}>Planning</option>
                                            <option value="Paused" style={{ backgroundColor: '#000' }}>Paused</option>
                                        </select>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => setShowProgramModal(false)}
                                        style={{ padding: '10px 20px', borderRadius: '5px', background: 'transparent', border: '1px solid #555', color: '#ccc', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProgram}
                                        style={{ padding: '10px 20px', borderRadius: '5px', background: 'var(--neon-cyan)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        {editingProgramIndex !== null ? 'Save Changes' : 'Launch Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ background: 'rgba(0,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-cyan)' }}>
                            <h3 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>1,250</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active Workers Deployed</p>
                        </div>
                        <div style={{ background: 'rgba(0,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-cyan)' }}>
                            <h3 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>$4.2M</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Program Budget Allocated</p>
                        </div>
                        <div style={{ background: 'rgba(0,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-cyan)' }}>
                            <h3 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>12</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active Regions</p>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '15px' }}>Active Programs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {programs.map((prog, idx) => (
                            <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{prog.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{prog.location} • {prog.workers} Workers</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: prog.status === 'Active' ? 'rgba(0,255,0,0.1)' : prog.status === 'Hiring' ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.1)',
                                        color: prog.status === 'Active' ? 'var(--neon-lime)' : prog.status === 'Hiring' ? 'var(--neon-cyan)' : '#fff',
                                        border: `1px solid ${prog.status === 'Active' ? 'var(--neon-lime)' : prog.status === 'Hiring' ? 'var(--neon-cyan)' : '#777'}`
                                    }}>
                                        {prog.status.toUpperCase()}
                                    </span>
                                    <button
                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
                                        onClick={() => handleOpenModal(idx)}
                                    >
                                        ⚙️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid var(--neon-purple)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ color: 'var(--neon-purple)' }}>Enterprise Workforce Management</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Tools for managing large-scale teams and bulk recruitment.</p>
                        </div>
                        <button onClick={() => setShowBulkModal(true)} className="btn-neon" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>+ Bulk Hire Request</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                            <h3 style={{ marginBottom: '15px' }}>Shift Management</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    <span>🌞 Morning Shift (08:00 - 16:00)</span>
                                    <span style={{ color: 'var(--neon-lime)' }}>145 / 150 Present</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    <span>🌤️ Afternoon Shift (16:00 - 00:00)</span>
                                    <span style={{ color: 'orange' }}>Starting in 2h</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    <span>🌚 Night Shift (00:00 - 08:00)</span>
                                    <span style={{ color: '#777' }}>Scheduled</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(128,0,128,0.1)', padding: '20px', borderRadius: '15px', border: '1px solid var(--neon-purple)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '3rem', margin: 0, color: 'var(--neon-purple)' }}>98%</h3>
                            <p>Retention Rate</p>
                            <small style={{ color: 'var(--text-muted)' }}>Top Employer Badge Earned</small>
                        </div>
                    </div>

                    <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Bulk Recruitment Drives</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Campaign Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Role</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Target</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Progress</th>
                                <th style={{ textAlign: 'right', padding: '10px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px 10px' }}>Holiday Season Logistics</td>
                                <td>Warehouse Staff</td>
                                <td>500</td>
                                <td>
                                    <div style={{ width: '100px', height: '6px', background: '#333', borderRadius: '3px', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}>
                                        <div style={{ width: '80%', height: '100%', background: 'var(--neon-purple)', borderRadius: '3px' }}></div>
                                    </div>
                                    412/500
                                </td>
                                <td style={{ textAlign: 'right', color: 'var(--neon-lime)' }}>Active</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '15px 10px' }}>Q1 Call Center Expansion</td>
                                <td>Support Agents</td>
                                <td>50</td>
                                <td>
                                    <div style={{ width: '100px', height: '6px', background: '#333', borderRadius: '3px', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}>
                                        <div style={{ width: '20%', height: '100%', background: 'orange', borderRadius: '3px' }}></div>
                                    </div>
                                    10/50
                                </td>
                                <td style={{ textAlign: 'right', color: 'orange' }}>Recruiting</td>
                            </tr>
                        </tbody>
                    </table>
                    {showBulkModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}>
                            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', width: '400px', border: '1px solid var(--neon-purple)' }}>
                                <h3 style={{ marginTop: 0, color: 'var(--neon-purple)' }}>🚀 New Bulk Recruitment Drive</h3>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', fontSize: '0.9rem' }}>Campaign Name</label>
                                        <input className="neon-input" value={bulkRequest.campaign} onChange={e => setBulkRequest({ ...bulkRequest, campaign: e.target.value })} placeholder="e.g. Summer Interns" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', fontSize: '0.9rem' }}>Target Role</label>
                                        <input className="neon-input" value={bulkRequest.role} onChange={e => setBulkRequest({ ...bulkRequest, role: e.target.value })} placeholder="e.g. Junior Developer" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', fontSize: '0.9rem' }}>Headcount Target</label>
                                        <input className="neon-input" type="number" value={bulkRequest.count} onChange={e => setBulkRequest({ ...bulkRequest, count: e.target.value })} placeholder="100" />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                        <button onClick={() => setShowBulkModal(false)} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '8px 15px', borderRadius: '5px' }}>Cancel</button>
                                        <button onClick={handleBulkSubmit} className="btn-neon" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>Launch Drive</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GovernmentEnterprisePortal;
