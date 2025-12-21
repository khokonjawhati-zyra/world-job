
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Globe, Lock } from 'lucide-react';

const AdminPaymentSettings = () => {
    const [config, setConfig] = useState({
        isSandbox: true,
        sslcommerz: { storeId: '', password: '' },
        stripe: { publicKey: '', secretKey: '' }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/payment-config')
            .then(res => res.json())
            .then(data => {
                if (data.sslcommerz) setConfig(data);
            })
            .catch(err => console.error("Failed to load payment config", err));
    }, []);

    const handleChange = (provider, field, value) => {
        setConfig(prev => ({
            ...prev,
            [provider]: {
                ...prev[provider],
                [field]: value
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/payment-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                setMessage('Configuration Secured & Saved!');
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
        <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Shield color="cyan" />
                    Payment Gateway Portal
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px 15px', borderRadius: '20px', border: '1px solid #444' }}>
                    <span style={{ fontSize: '0.9rem', color: config.isSandbox ? 'orange' : '#0f0' }}>
                        {config.isSandbox ? 'SANDBOX MODE' : 'LIVE MODE'}
                    </span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={!config.isSandbox}
                            onChange={(e) => setConfig({ ...config, isSandbox: !e.target.checked })}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '0.9rem' }}>
                <Lock size={14} style={{ display: 'inline', marginRight: '5px' }} />
                Credentials are encrypted using AES-256 before storage. Keys are never exposed in plain text logs.
            </p>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '30px' }}>
                {/* SSLCommerz Section */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', color: 'orange' }}>SSLCommerz (Bangladesh)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Store ID</label>
                            <input
                                className="neon-input"
                                type="text"
                                placeholder="my_store_id"
                                value={config.sslcommerz.storeId}
                                onChange={(e) => handleChange('sslcommerz', 'storeId', e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Store Password</label>
                            <input
                                className="neon-input"
                                type="password"
                                placeholder="••••••••"
                                value={config.sslcommerz.password}
                                onChange={(e) => handleChange('sslcommerz', 'password', e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stripe Section */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', color: '#635bff' }}>Stripe (International)</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Publishable Key</label>
                            <input
                                className="neon-input"
                                type="text"
                                placeholder="pk_test_..."
                                value={config.stripe.publicKey}
                                onChange={(e) => handleChange('stripe', 'publicKey', e.target.value)}
                                style={{ width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.8rem' }}>Secret Key</label>
                            <input
                                className="neon-input"
                                type="password"
                                placeholder="sk_test_..."
                                value={config.stripe.secretKey}
                                onChange={(e) => handleChange('stripe', 'secretKey', e.target.value)}
                                style={{ width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>
                    {message && <span style={{ color: message.includes('failed') ? 'red' : '#0f0' }}>{message}</span>}
                    <button type="submit" className="btn-neon" disabled={loading} style={{ padding: '10px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={18} />
                        {loading ? 'Encrypting & Saving...' : 'Save Configurations'}
                    </button>
                </div>
            </form>

            <style>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }
                .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: #2196F3;
                }
                input:focus + .slider {
                    box-shadow: 0 0 1px #2196F3;
                }
                input:checked + .slider:before {
                    -webkit-transform: translateX(20px);
                    -ms-transform: translateX(20px);
                    transform: translateX(20px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default AdminPaymentSettings;
