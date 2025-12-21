import React, { useState, useEffect } from 'react';

const AdminTCEditor = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('https://world-job-backend.vercel.app/settings/terms')
            .then(res => res.json())
            .then(data => {
                setText(data.text);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch('https://world-job-backend.vercel.app/settings/terms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
            .then(res => res.json())
            .then(() => {
                alert('Terms & Conditions updated successfully!');
                setSaving(false);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to save changes.');
                setSaving(false);
            });
    };

    if (loading) return <div className="glass-panel" style={{ padding: '30px' }}>Loading Editor...</div>;

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--neon-cyan)' }}>Edit Terms & Conditions</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Update the platform's Terms and Conditions. You can use basic HTML tags for formatting.
            </p>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '20px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: 'vertical',
                    lineHeight: '1.5'
                }}
            />

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleSave}
                    className="btn-neon"
                    disabled={saving}
                    style={{ padding: '12px 30px' }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminTCEditor;
