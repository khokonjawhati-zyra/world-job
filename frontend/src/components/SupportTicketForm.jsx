import React, { useState } from 'react';

const SupportTicketForm = ({ onClose }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch('http://localhost:3000/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: '101', // Dynamic in real app
                userType: 'worker', // Dynamic in real app
                subject,
                description,
                priority
            })
        })
            .then(res => res.json())
            .then(() => {
                alert('Support Ticket Submitted Successfully!');
                setIsSubmitting(false);
                onClose();
            })
            .catch(err => {
                console.error(err);
                alert('Error submitting ticket.');
                setIsSubmitting(false);
            });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ width: '500px', padding: '30px', borderRadius: '15px', position: 'relative', background: '#1a1a1a', border: '1px solid var(--glass-border)' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                    ✕
                </button>
                <h2 style={{ marginBottom: '20px', color: 'var(--neon-cyan)' }}>Submit Support Ticket</h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Priority</label>
                        <select
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows="5"
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: '#fff', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: '5px', background: 'transparent', border: '1px solid #333', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-neon" style={{ padding: '8px 20px', cursor: 'pointer' }}>
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupportTicketForm;
