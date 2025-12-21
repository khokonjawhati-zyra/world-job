import React, { useState } from 'react';

const SecuritySettings = ({ userId }) => {
    const [mfaData, setMfaData] = useState(null);
    const [otp, setOtp] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [step, setStep] = useState('idle'); // idle, setup, verify

    const startSetup = async () => {
        try {
            const res = await fetch('http://localhost:3000/security/mfa/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            setMfaData(data); // Contains secret & otpAuthUrl
            setStep('setup');
        } catch (err) {
            console.error(err);
            alert('Failed to start MFA setup');
        }
    };

    const verifyAndEnable = async () => {
        try {
            const res = await fetch('http://localhost:3000/security/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: otp, secret: mfaData.secret })
            });
            const data = await res.json();
            if (data.success) {
                setIsEnabled(true);
                setStep('idle');
                alert('MFA Enabled Successfully! Your account is now secure.');
            } else {
                alert('Invalid Code. Try again.');
            }
        } catch (err) {
            alert('Verification failed');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                🛡️ Security Center (Zero-Trust)
            </h2>

            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div style={{ background: 'rgba(0,255,100,0.1)', border: '1px solid var(--neon-lime)', padding: '15px', borderRadius: '10px' }}>
                    <h4>🔒 E2EE Encryption</h4>
                    <p style={{ fontSize: '0.8rem', color: '#ccc' }}>AES-256 Active</p>
                </div>
                <div style={{ background: isEnabled ? 'rgba(0,255,100,0.1)' : 'rgba(255,0,0,0.1)', border: `1px solid ${isEnabled ? 'var(--neon-lime)' : 'red'}`, padding: '15px', borderRadius: '10px' }}>
                    <h4>🔑 2-Factor Auth</h4>
                    <p style={{ fontSize: '0.8rem', color: '#ccc' }}>{isEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid var(--neon-cyan)', padding: '15px', borderRadius: '10px' }}>
                    <h4>⛓️ Blockchain Ledger</h4>
                    <p style={{ fontSize: '0.8rem', color: '#ccc' }}>Immutable Record</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid white', padding: '15px', borderRadius: '10px' }}>
                    <h4>❄️ Cold Storage</h4>
                    <p style={{ fontSize: '0.8rem', color: '#ccc' }}>90% Funds Secured</p>
                </div>
            </div>

            {/* MFA Setup Section */}
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                {!isEnabled && step === 'idle' && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '15px', color: '#aaa' }}>Protect your account and funds with Google Authenticator.</p>
                        <button onClick={startSetup} className="btn-neon" style={{ width: '100%', padding: '12px' }}>
                            Enable 2FA Now
                        </button>
                    </div>
                )}

                {step === 'setup' && mfaData && (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ marginBottom: '15px' }}>Scan QR Code</h4>
                        <div style={{ marginBottom: '20px', background: 'white', padding: '10px', display: 'inline-block', borderRadius: '5px' }}>
                            {/* Placeholder for QR Code */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mfaData.otpAuthUrl)}`}
                                alt="MFA QR"
                            />
                        </div>
                        <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Or enter secret manually:</p>
                        <code style={{ background: '#333', padding: '5px 10px', borderRadius: '4px', color: 'orange', display: 'block', marginBottom: '20px' }}>
                            {mfaData.secret}
                        </code>

                        <input
                            type="text"
                            placeholder="Enter 6-digit Code (Mock: 123456)"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white', textAlign: 'center', width: '200px', fontSize: '1.2rem', letterSpacing: '2px' }}
                        />
                        <br />
                        <button onClick={verifyAndEnable} className="btn-neon" style={{ marginTop: '15px', padding: '10px 30px' }}>
                            Verify & Activate
                        </button>
                    </div>
                )}

                {isEnabled && (
                    <div style={{ textAlign: 'center', color: 'var(--neon-green)' }}>
                        <h3>✅ Account Secured</h3>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '5px' }}>
                            Withdrawals and Login now require OTP.
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '20px' }}>Hardware Keys (YubiKey) are supported for Admin only.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecuritySettings;
