import React, { useState, useEffect } from 'react';

const NDAModal = ({ isOpen, onClose, onSign, investorId, userId, projectTitle = 'Project', type = 'NDA' }) => {
    const effectiveUserId = userId || investorId;
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasRead, setHasRead] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signatureName, setSignatureName] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetch('https://world-job-backend.vercel.app/investment/legal/templates')
                .then(res => res.json())
                .then(data => {
                    setTerms(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load legal terms", err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleSign = async () => {
        if (!signatureName.trim()) return alert("Please type your full name to sign.");
        setSigning(true);
        await onSign(signatureName);
        setSigning(false);
        setSignatureName('');
        onClose();
    };

    if (!isOpen) return null;

    const titles = {
        'NDA': '🛡️ Digital NDA & Liability Shield',
        'WAIVER': '⚠️ Liability Risk Waiver',
        'CONTRACT': '📜 Digital Work Confirmation'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel" style={{
                width: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                border: type === 'WAIVER' ? '1px solid red' : '1px solid cyan',
                boxShadow: type === 'WAIVER' ? '0 0 20px rgba(255,0,0,0.2)' : '0 0 20px rgba(0,255,255,0.2)'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ margin: 0, color: type === 'WAIVER' ? 'red' : 'cyan', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {titles[type] || titles['NDA']}
                    </h2>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#888' }}>
                        Protocol ID: {effectiveUserId}-{Date.now()}
                    </p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
                    {loading ? (
                        <p>Loading Secure Contract...</p>
                    ) : (
                        <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                            {type === 'NDA' && (
                                <>
                                    <h4 style={{ color: '#fff' }}>1. Non-Disclosure Agreement</h4>
                                    <p>{terms?.dataConfidentiality}</p>
                                    <h4 style={{ color: '#fff' }}>2. Non-Circumvention Rule</h4>
                                    <p style={{ color: '#ffaa00' }}>{terms?.nonCircumvention}</p>
                                </>
                            )}

                            {(type === 'WAIVER' || type === 'CONTRACT') && (
                                <>
                                    <h4 style={{ color: '#fff' }}>1. Liability Exemption</h4>
                                    <p>{terms?.liability}</p>
                                    <h4 style={{ color: '#fff' }}>2. Independent Contractor Acknowledgement</h4>
                                    <p>By signing, you confirm that you are engaging these services as an independent professional. The platform serves only as a secure escrow and communication channel.</p>
                                </>
                            )}

                            <h4 style={{ color: '#fff' }}>{type === 'NDA' ? '3' : '3'}. Admin Indemnification Clause</h4>
                            <div style={{
                                border: '1px solid red', background: 'rgba(255,0,0,0.1)', padding: '10px',
                                borderRadius: '4px', fontWeight: 'bold', color: '#ffaaaa'
                            }}>
                                {terms?.adminExemption || terms?.liability}
                            </div>

                            <br />
                            <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                                By digitally signing this document, you acknowledge that your IP Address, Browser Fingerprint, and User ID are being logged for legal audit trails.
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: '#aaa' }}>Type Full Legal Name to Sign:</label>
                        <input
                            type="text"
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', color: '#fff', background: '#000', border: '1px solid #333' }}
                            placeholder="e.g. John Doe"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                        />
                    </div>

                    <label htmlFor="nda-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
                        <input
                            id="nda-checkbox"
                            type="checkbox"
                            checked={hasRead}
                            onChange={(e) => setHasRead(e.target.checked)}
                            style={{ accentColor: 'cyan', width: '20px', height: '20px' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>
                            I have read the terms above and agree to be legally bound.
                        </span>
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="btn-neon"
                            onClick={handleSign}
                            disabled={!hasRead || signing || signatureName.length < 3}
                            style={{ flex: 1, position: 'relative', opacity: (!hasRead || signatureName.length < 3) ? 0.5 : 1 }}
                        >
                            {signing ? 'Encryption Keys Generating...' : `Digitally Sign as [${effectiveUserId}]`}
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 20px', background: 'transparent',
                                border: '1px solid #444', color: '#888', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            Decline & Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NDAModal;
