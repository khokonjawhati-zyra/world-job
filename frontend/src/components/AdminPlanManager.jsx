
import React, { useState, useEffect } from 'react';

const AdminPlanManager = () => {
    const [plans, setPlans] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', role: 'worker', price: 0, description: '', features: '' });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = () => {
        fetch('http://localhost:3001/monetization/all-plans')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPlans(data);
            })
            .catch(console.error);
    };

    const handleCreate = () => {
        const newPlan = {
            ...createForm,
            id: `p_${Date.now()}`,
            features: createForm.features.split(',').map(f => f.trim()) // simple comma separation
        };

        fetch('http://localhost:3001/monetization/create-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlan)
        })
            .then(res => res.json())
            .then(() => {
                alert('Plan created!');
                setShowCreate(false);
                fetchPlans();
            })
            .catch(console.error);
    };

    // ... existing edit logic ...

    const handleEdit = (plan) => {
        setEditingId(plan.id);
        setEditForm({ ...plan });
    };

    const handleSave = () => {
        fetch(`http://localhost:3001/monetization/plans/${editingId}?id=${editingId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        })
            .then(res => res.json())
            .then(() => {
                alert('Plan updated successfully!');
                setEditingId(null);
                fetchPlans();
            })
            .catch(console.error);
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--neon-cyan)', margin: 0 }}>💎 Subscription Plan Management</h2>
                <button onClick={() => setShowCreate(true)} className="btn-neon" style={{ fontSize: '0.9rem' }}>+ Create New Plan</button>
            </div>

            {showCreate && (
                <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--neon-cyan)' }}>
                    <h3 style={{ marginBottom: '15px' }}>Create New Plan</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <input placeholder="Plan Name" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }} />
                        <select value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })} style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }}>
                            <option value="worker">Worker</option>
                            <option value="employer">Employer</option>
                        </select>
                        <input type="number" placeholder="Price" value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: parseFloat(e.target.value) })} style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }} />
                        <input placeholder="Description" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }} />
                        <textarea placeholder="Features (comma separated)" value={createForm.features} onChange={e => setCreateForm({ ...createForm, features: e.target.value })} style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px', height: '80px' }} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleCreate} className="btn-neon">Create Plan</button>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#ccc', border: '1px solid #555', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            <div style={{ display: 'grid', gap: '20px' }}>
                {plans.map(plan => (
                    <div key={plan.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: editingId === plan.id ? '1px solid var(--neon-pink)' : '1px solid transparent' }}>
                        {editingId === plan.id ? (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#888', fontSize: '0.8rem' }}>Plan Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#888', fontSize: '0.8rem' }}>Price ($)</label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={handleSave} className="btn-neon" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>Save Changes</button>
                                    <button onClick={() => setEditingId(null)} style={{ padding: '5px 15px', fontSize: '0.9rem', background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{plan.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({plan.role})</span></h3>
                                    <p style={{ color: 'var(--neon-lime)', fontWeight: 'bold', margin: '5px 0' }}>${plan.price}/mo</p>
                                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{plan.description}</p>
                                </div>
                                <button onClick={() => handleEdit(plan)} className="btn-neon" style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid #555' }}>
                                    Edit Rate
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPlanManager;
