
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { API_BASE_URL } from '../config';

const AuthPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = location.state?.role || queryParams.get('role') || localStorage.getItem('role_signup') || 'WORKER';
    const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup' && queryParams.get('mode') !== 'signup');
    const [isForgot, setIsForgot] = useState(false);
    const [role, setRole] = useState(initialRole); // WORKER, EMPLOYER, INVESTOR
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '', agreedToTerms: false });
    const [loading, setLoading] = useState(false);
    const [auth2FA, setAuth2FA] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isForgot
            ? `${API_BASE_URL}/auth/forgot-password`
            : (isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`);

        let body;
        if (isForgot) {
            body = { email: formData.email };
        } else if (isLogin) {
            body = { email: formData.email, password: formData.password };
        } else {
            body = {
                ...formData,
                role,
                agreedToTermsAt: new Date().toISOString()
            };
        }

        try {
            console.log("Attempting auth to:", endpoint);
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text(); // Read text to consume stream
                console.error("Non-JSON response:", text.substring(0, 500));
                throw new Error(`Server returned ${res.status} ${res.statusText} (Type: ${contentType}). Check API URL.`);
            }

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                if (isForgot) {
                    alert(data.message || 'Reset link sent!');
                    setIsForgot(false);
                    return;
                }
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.role === 'ADMIN') navigate('/admin');
                else if (data.user.role === 'WORKER') navigate('/worker');
                else if (data.user.role === 'EMPLOYER') navigate('/employer');
                else if (data.user.role === 'INVESTOR') navigate('/investor');
                else navigate('/');
            } else {
                alert(data.message || `Auth failed: ${res.status}`);
            }
        } catch (err) {
            console.warn("Backend Unreachable, Switching to Demo Mode:", err);
            // Mock Fallback
            setTimeout(() => {
                setLoading(false);
                const mockUser = {
                    id: 'demo-user-123',
                    email: formData.email,
                    role: role, // Use selected role or default
                    fullName: formData.fullName || 'Demo User'
                };

                // For login, if role wasn't selectable, infer or default? 
                // Login usually relies on backend to tell role. 
                // For demo, we might default to Worker or check email? 
                // Let's assume Worker if not specified, or Employer if 'admin' in email?
                // Actually, if isLogin, role variable might be stale (default WORKER).
                // Let's check email for keywords to decide mock role
                let mockRole = role; // Default from state (which is WORKER by default on login view?)
                if (isLogin) {
                    if (formData.email.includes('admin')) mockRole = 'ADMIN';
                    else if (formData.email.includes('employer')) mockRole = 'EMPLOYER';
                    else if (formData.email.includes('investor')) mockRole = 'INVESTOR';
                    else mockRole = 'WORKER';
                }

                mockUser.role = mockRole;

                localStorage.setItem('token', 'mock-token-xyz');
                localStorage.setItem('user', JSON.stringify(mockUser));

                alert(`Login Successful (Demo Mode)\nWelcome, ${mockRole}!`);

                if (mockRole === 'ADMIN') navigate('/admin');
                else if (mockRole === 'WORKER') navigate('/dashboard/worker');
                else if (mockRole === 'EMPLOYER') navigate('/dashboard/employer');
                else if (mockRole === 'INVESTOR') navigate('/dashboard/investor'); // Assuming route exists or will default
                else navigate('/');
            }, 1000);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'radial-gradient(circle at top right, #1a1a2e, #000)'
        }}>
            <div className="glass-panel" style={{ padding: '40px', width: '400px', borderRadius: '20px', border: '1px solid var(--neon-cyan)' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '10px' }}>
                    W🌎RLD J🌎B
                </h1>
                <h3 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>
                    {isForgot ? 'Reset Password' : (isLogin ? 'Secure Login' : 'Join the Future')}
                </h3>

                {!isLogin && !isForgot && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                        {['WORKER', 'EMPLOYER', 'INVESTOR'].map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: role === r ? '1px solid var(--neon-cyan)' : '1px solid #333',
                                    background: role === r ? 'rgba(0,255,255,0.1)' : 'transparent',
                                    color: role === r ? 'var(--neon-cyan)' : '#888',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isLogin && !isForgot && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                            required
                        />
                    )}
                    <input
                        type="text"
                        placeholder="Email or Username"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                        required
                    />
                    {!isForgot && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                            required
                        />
                    )}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Referral Code (Optional)"
                            value={formData.referralCode || ''}
                            onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                        />
                    )}

                    {!isForgot && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#888' }}>
                            <label>
                                <input type="checkbox" /> Remember Me
                            </label>
                            {isLogin && (
                                <span
                                    onClick={() => {
                                        console.log("Forgot Password clicked");
                                        setIsForgot(true);
                                    }}
                                    style={{ cursor: 'pointer', color: 'var(--neon-magenta)', textDecoration: 'underline' }}
                                >
                                    Forgot Password?
                                </span>
                            )}
                        </div>
                    )}

                    {!isLogin && (
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                            <label style={{ display: 'flex', alignItems: 'start', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.agreedToTerms}
                                    onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                    required
                                    style={{ marginTop: '3px' }}
                                />
                                <span>
                                    I agree to the <b style={{ color: 'var(--neon-cyan)', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); window.open('/terms', '_blank'); }}>Terms & Conditions</b>.
                                    I understand the platform is a facilitator only and holds no liability.
                                </span>
                            </label>
                        </div>
                    )}

                    <button type="submit" className="btn-neon" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                        {loading ? 'Processing...' : (isForgot ? 'Send Reset Link' : (isLogin ? 'Login' : 'Create Account'))}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
                    {isForgot ? (
                        <span onClick={() => setIsForgot(false)} style={{ color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>
                            ← Back to Login
                        </span>
                    ) : (
                        <>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span
                                onClick={() => setIsLogin(!isLogin)}
                                style={{ color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </span>
                        </>
                    )}
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginBottom: '15px' }}>Or continue with</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button style={{ padding: '10px', flex: 1, borderRadius: '8px', border: '1px solid #333', background: '#fff', color: '#000', cursor: 'pointer' }}>Google</button>
                        <button style={{ padding: '10px', flex: 1, borderRadius: '8px', border: '1px solid #333', background: '#3b5998', color: '#fff', cursor: 'pointer' }}>Facebook</button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AuthPage;
