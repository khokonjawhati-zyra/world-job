import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({ fullName: '', role: '', email: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch('https://world-job-backend.vercel.app/auth/admin/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoading(false);
            });
    };

    const handleAction = (user, action) => {
        if (action === 'View') {
            setSelectedUser(user);
            setViewMode(true);
        } else if (action === 'Edit') {
            setSelectedUser(user);
            setFormData({ fullName: user.fullName, role: user.role, email: user.email });
            setEditMode(true);
        } else if (action === 'Ban') {
            if (window.confirm(`Are you sure you want to BAN ${user.fullName}?`)) {
                fetch(`https://world-job-backend.vercel.app/auth/admin/users/${user.userId}/ban`, { method: 'POST' })
                    .then(res => res.json())
                    .then(() => {
                        alert("User Banned Successfully");
                        fetchUsers();
                    })
                    .catch(err => alert("Failed to ban: " + err.message));
            }
        }
    };

    const saveChanges = () => {
        if (!selectedUser) return;
        fetch(`https://world-job-backend.vercel.app/auth/admin/users/${selectedUser.userId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => {
                alert("User Updated!");
                setEditMode(false);
                setSelectedUser(null);
                fetchUsers();
            })
            .catch(err => alert("Failed to updates: " + err.message));
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', minHeight: '80vh', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>User Management</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '20px',
                            border: '1px solid #444',
                            background: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            minWidth: '250px'
                        }}
                    />
                    <button onClick={fetchUsers} className="btn-neon">Refresh List</button>
                    <button className="btn-neon" style={{ background: 'var(--neon-green)', color: '#000' }}>+ Add User</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Loading Users...</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Referrals</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '30px', textAlign: 'center' }}>No users found matching "{searchTerm}"</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', background: user.status === 'BANNED' ? 'rgba(255,0,0,0.1)' : 'transparent' }}>
                                    <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.userId.substring(0, 8)}...</td>
                                    <td style={{ fontWeight: 'bold', color: '#fff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(45deg, #333, #555)' }}></div>
                                            {user.fullName}
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: user.role === 'ADMIN' ? 'rgba(255,0,0,0.2)' : user.role === 'EMPLOYER' ? 'rgba(0,255,255,0.1)' : 'rgba(0,255,100,0.1)',
                                            color: user.role === 'ADMIN' ? 'red' : user.role === 'EMPLOYER' ? 'cyan' : 'lime'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                                            <span style={{ color: 'gold' }}>Count: {user.referralCount || 0}</span>
                                            <span style={{ color: '#888' }}>Earned: ${user.referralEarnings || 0}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {user.status === 'BANNED' ?
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>BANNED</span> :
                                            <span style={{ color: 'var(--neon-green)' }}>Active</span>}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleAction(user, 'View')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} title="View Profile">👁️</button>
                                            <button onClick={() => handleAction(user, 'Edit')} style={{ background: 'none', border: 'none', color: 'cyan', cursor: 'pointer' }} title="Edit">✏️</button>
                                            {user.status !== 'BANNED' && (
                                                <button onClick={() => handleAction(user, 'Ban')} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }} title="Ban User">🚫</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666', textAlign: 'right' }}>
                Showing {filteredUsers.length} users
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editMode && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="glass-panel"
                            style={{ width: '400px', padding: '30px', borderRadius: '15px', background: '#1a1a2e', border: '1px solid var(--neon-cyan)' }}
                        >
                            <h3>Edit User</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                <input
                                    type="text" placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff' }}
                                />
                                <input
                                    type="text" placeholder="Email (Read Only)"
                                    value={formData.email}
                                    disabled
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#888' }}
                                />
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff' }}
                                >
                                    <option value="WORKER">Worker</option>
                                    <option value="EMPLOYER">Employer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button onClick={() => setEditMode(false)} style={{ padding: '8px 15px', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={saveChanges} className="btn-neon">Save Changes</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Modal */}
            <AnimatePresence>
                {viewMode && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}
                        onClick={() => setViewMode(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="glass-panel"
                            style={{ width: '500px', padding: '30px', borderRadius: '15px', background: '#1a1a2e', border: '1px solid var(--neon-cyan)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>User Details</h3>
                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', color: '#ccc' }}>
                                <strong>User ID:</strong> <span>{selectedUser.userId}</span>
                                <strong>Full Name:</strong> <span>{selectedUser.fullName}</span>
                                <strong>Email:</strong> <span>{selectedUser.email}</span>
                                <strong>Role:</strong> <span style={{ color: 'var(--neon-cyan)' }}>{selectedUser.role}</span>
                                <strong>Status:</strong> <span>{selectedUser.status || 'Active'}</span>
                                <strong>Joined:</strong> <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                                <strong>Referral Code:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedUser.referralCode}</span>
                                <strong>Referrer ID:</strong> <span>{selectedUser.referredBy || 'None'}</span>
                            </div>
                            <button
                                onClick={() => setViewMode(false)}
                                className="btn-neon"
                                style={{ marginTop: '20px', width: '100%', background: '#333', border: '1px solid #555' }}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUserManagement;
