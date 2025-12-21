
import React, { useState } from 'react';

const BroadcastCenter = () => {
    const [form, setForm] = useState({ title: '', content: '', targetRole: 'ALL', type: 'INFO', isPersistent: false, priority: 'MEDIUM' });

    const sendBroadcast = async () => {
        if (!form.title || !form.content) return alert('Please fill in title and content');

        try {
            await fetch('https://world-job-backend.vercel.app/notifications/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            alert('Broadcast Sent Successfully! 🚀');
            setForm({ ...form, title: '', content: '' });
        } catch (e) {
            alert('Failed to send broadcast');
            console.error(e);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)',
        border: '1px solid #444', borderRadius: '8px', color: '#fff', marginBottom: '15px'
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h2 style={{ background: 'linear-gradient(90deg, #00cbff, #9900ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px' }}>
                📢 Targeted Broadcast Center
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ color: '#aaa', marginBottom: '5px', display: 'block' }}>Headline / Title</label>
                    <input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. System Maintenance Update"
                        style={inputStyle}
                    />

                    <label style={{ color: '#aaa', marginBottom: '5px', display: 'block' }}>Target Audience</label>
                    <select
                        value={form.targetRole}
                        onChange={e => setForm({ ...form, targetRole: e.target.value })}
                        style={inputStyle}
                    >
                        <option value="ALL">Everyone (Global)</option>
                        <option value="worker">All Workers</option>
                        <option value="employer">All Employers</option>
                        <option value="investor">All Investors</option>
                    </select>
                </div>

                <div>
                    <label style={{ color: '#aaa', marginBottom: '5px', display: 'block' }}>Notification Type</label>
                    <select
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                        style={inputStyle}
                    >
                        <option value="INFO">ℹ️ General Info</option>
                        <option value="WARNING">⚠️ Warning / Important</option>
                        <option value="ALERT">🚨 Critical Alert</option>
                        <option value="BANNER">🚩 Sticky Banner</option>
                    </select>

                    <label style={{ color: '#aaa', marginBottom: '5px', display: 'block' }}>Options</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.isPersistent}
                                onChange={e => setForm({ ...form, isPersistent: e.target.checked })}
                            />
                            Persistent (Stay at top)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.priority === 'HIGH'}
                                onChange={e => setForm({ ...form, priority: e.target.checked ? 'HIGH' : 'MEDIUM' })}
                            />
                            High Priority
                        </label>
                    </div>
                </div>
            </div>

            <label style={{ color: '#aaa', marginBottom: '5px', display: 'block' }}>Message Content (Rich Text Supported)</label>
            <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Enter your message here... Supports basic HTML or Markdown."
                style={{ ...inputStyle, height: '120px', fontFamily: 'monospace' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={sendBroadcast} className="btn-neon" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
                    RELEASE BROADCAST 📡
                </button>
            </div>
        </div>
    );
};
export default BroadcastCenter;
