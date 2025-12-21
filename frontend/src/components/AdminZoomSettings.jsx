
import React, { useState, useEffect } from 'react';
import { Save, Video, Lock } from 'lucide-react';

const AdminZoomSettings = () => {
    const [config, setConfig] = useState({
        accountId: '',
        clientId: '',
        clientSecret: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/zoom/config')
            .then(res => res.json())
            .then(data => {
                if (data.accountId) setConfig(data);
            })
            .catch(err => console.error("Failed to load zoom config", err));
    }, []);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/zoom/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                setMessage('Zoom Credentials Encrypted & Saved!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Save failed.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Network Error');
        }
        setLoading(false);
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video color="#2D8CFF" />
                    Zoom Meeting Settings
                </h2>
            </div>

            <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '0.9rem' }}>
                <Lock size={14} style={{ display: 'inline', marginRight: '5px' }} />
                Server-to-Server OAuth credentials are encrypted using AES-256.
            </p>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Zoom Account ID</label>
                            <input
                                className="neon-input"
                                type="text"
                                placeholder="Account ID from Zoom App Marketplace"
                                value={config.accountId}
                                onChange={(e) => handleChange('accountId', e.target.value)}
                                style={{ width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Client ID</label>
                            <input
                                className="neon-input"
                                type="text"
                                placeholder="Client ID"
                                value={config.clientId}
                                onChange={(e) => handleChange('clientId', e.target.value)}
                                style={{ width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Client Secret</label>
                            <input
                                className="neon-input"
                                type="password"
                                placeholder="Client Secret"
                                value={config.clientSecret}
                                onChange={(e) => handleChange('clientSecret', e.target.value)}
                                style={{ width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>
                    {message && <span style={{ color: message.includes('failed') ? 'red' : '#0f0' }}>{message}</span>}
                    <button type="submit" className="btn-neon" disabled={loading} style={{ padding: '10px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={18} />
                        {loading ? 'Encrypting...' : 'Save Zoom Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminZoomSettings;
