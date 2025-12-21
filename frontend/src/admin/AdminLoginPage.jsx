
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.username, password: credentials.password })
            });
            const data = await res.json();

            // Fallback for hardcoded admin if backend fails or for testing
            if (!res.ok && credentials.username === 'admin' && credentials.password === 'admin123') {
                console.log('Using Admin Fallback...');
                localStorage.setItem('user', JSON.stringify({ role: 'ADMIN', username: 'admin' }));
                window.location.href = '/admin'; // Force reload to ensure routing picks up
                return;
            }

            if (res.ok) {
                if (data.user.role !== 'ADMIN') {
                    setError('Access Denied: Not an Admin account.');
                    return;
                }
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            // Fallback for offline/dev
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                console.log('Using Admin Fallback (Offline)...');
                localStorage.setItem('user', JSON.stringify({ role: 'ADMIN', username: 'admin' }));
                window.location.href = '/admin';
            } else {
                setError('Connection Error');
            }
        }
    };

    return (
        <div className="landing-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bg-glow glow-top"></div>
            <div className="bg-glow glow-bottom"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '30px', transform: 'scale(1.2)' }}>
                    <Logo />
                </div>

                <h2 style={{ marginBottom: '10px', color: '#fff' }}>Admin Panel Access</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>Secure System Entry</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '5px' }}>Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '5px' }}>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--neon-pink)', fontSize: '0.8rem' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn-neon"
                        style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '1rem' }}
                    >
                        Login to Dashboard
                    </button>
                </form>

                <p style={{ marginTop: '30px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Authorized personnel only. <br /> Access attempts are logged.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
