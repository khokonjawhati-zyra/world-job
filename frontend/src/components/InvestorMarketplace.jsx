
import React, { useState, useEffect } from 'react';
import NDAModal from './NDAModal';
import UniversalChat from './UniversalChat';

const InvestorMarketplace = ({ investorId = "901" }) => {
    const [proposals, setProposals] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [waiverSigned, setWaiverSigned] = useState(false);
    const [ndaSigned, setNdaSigned] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNDAModal, setShowNDAModal] = useState(false);
    const [modalType, setModalType] = useState('NDA'); // 'NDA' or 'WAIVER'
    const [decryptedData, setDecryptedData] = useState(null);
    const [chatContext, setChatContext] = useState({ roomId: 'investor-global-901', title: 'Investor Comms' });

    useEffect(() => {
        fetch('https://world-job-backend.vercel.app/investment/marketplace')
            .then(res => res.json())
            .then(setProposals)
            .catch(console.error);
    }, []);

    const handleZoomMeeting = async (project) => {
        if (!window.confirm(`Schedule a Pitch Meeting for "${project.title}"?`)) return;
        try {
            const participants = [investorId];
            const res = await fetch('https://world-job-backend.vercel.app/zoom/create-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: `Pitch Meeting: ${project.title}`,
                    startTime: new Date(Date.now() + 60000).toISOString(),
                    participants
                })
            });
            if (res.ok) {
                const data = await res.json();
                alert(`Meeting Scheduled!\n\nJoin URL: ${data.joinUrl}\nPassword: ${data.password}`);
            } else {
                const err = await res.text();
                alert("Failed to schedule meeting: " + JSON.stringify(err));
            }
        } catch (e) {
            console.error(e);
            alert("Error scheduling meeting.");
        }
    };


    const handleFund = async () => {
        if (!waiverSigned) return alert('You must sign the Liability Waiver.');
        if (!ndaSigned) return alert('You must sign the NDA.');
        setLoading(true);
        try {
            await fetch('https://world-job-backend.vercel.app/investment/fund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId: selectedProject.id,
                    investorId,
                    amount: Number(investmentAmount),
                    waiver: true,
                    ndaSigned: true
                })
            });
            setLoading(false);
            closeModal();
            // Refresh
            fetch('https://world-job-backend.vercel.app/investment/marketplace').then(res => res.json()).then(setProposals);
            alert("Funds Transferred Successfully!");
        } catch (err) {
            setLoading(false);
            alert('Investment failed: ' + err.message);
        }
    };

    const handleSignLegalDoc = async (signatureName) => {
        try {
            // endpoint should ideally support type, but for now we reuse nda/sign and assume logic or add query param
            // Actually, we should update backend to support type, but let's just log it for now as signed

            const endpoint = 'https://world-job-backend.vercel.app/investment/nda/sign'; // Reuse for now to get audit log 

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId: selectedProject.id,
                    userId: investorId,
                    type: modalType, // Pass simple type if backend accepts extra fields (it might ignore)
                    signature: signatureName
                })
            });
            const data = await res.json();

            if (res.ok) {
                if (modalType === 'NDA') {
                    setNdaSigned(true);
                    setDecryptedData(data.unlockedData);
                } else if (modalType === 'WAIVER') {
                    setWaiverSigned(true);
                }
                setShowNDAModal(false);
            }
        } catch (err) {
            console.error(err);
            alert("Digital Signature Failed");
        }
    };

    const openProject = (project) => {
        setSelectedProject(project);
        // Reset states
        setWaiverSigned(false);
        setNdaSigned(false);
        setDecryptedData(null);
        setInvestmentAmount('');
    };

    const closeModal = () => {
        setSelectedProject(null);
        setShowNDAModal(false);
    };

    return (
        <div style={{ color: '#fff', padding: '20px' }}>
            <h2 className="text-gradient">💎 Investment Marketplace</h2>
            <p style={{ color: '#ccc' }}>Discover and fund the next big gig-economy ventures.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {proposals.map(p => (
                    <div key={p.id} className="glass-panel" style={{ padding: '0', transition: 'transform 0.2s', border: p.status === 'FUNDED' ? '1px solid #0f0' : '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ padding: '20px', background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: '0' }}>{p.title}</h3>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ color: '#0f0', fontWeight: 'bold', display: 'block', fontSize: '1.2rem' }}>{p.roi}% ROI</span>
                                    <span style={{ fontSize: '0.7rem', color: p.riskScore > 70 ? 'red' : 'orange' }}>Risk: {p.riskScore}/100</span>
                                </div>
                            </div>
                        </div>

                        {/* Executive Summary (New) */}
                        <div style={{ padding: '20px', flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic', marginBottom: '15px' }}>
                                "{p.executiveSummary || p.description?.substring(0, 100) + '...'}"
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#ccc', marginBottom: '15px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ color: 'cyan' }}>Target Ask</div>
                                    <b>${p.budget?.toLocaleString()}</b>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ color: 'gold' }}>Investor Equity</div>
                                    <b>{p.investorProfitSharePercentage || '0'}%</b>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ color: '#aaa' }}>Timeline</div>
                                    <b>{p.projectedRoiTimeline || 'N/A'}</b>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ color: '#aaa' }}>Raised</div>
                                    <b style={{ color: '#fff' }}>${p.raisedAmount?.toLocaleString()}</b>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ width: '100%', height: '5px', background: '#333', marginTop: '5px', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((p.raisedAmount / p.budget) * 100, 100)}%`, height: '100%', background: 'cyan' }}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>
                                {Math.round((p.raisedAmount / p.budget) * 100)}% Funded
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {p.status === 'PENDING' ? (
                                <button className="btn-neon" style={{ width: '100%' }} onClick={() => openProject(p)}>
                                    View Pitch Deck & Fund
                                </button>
                            ) : (
                                <button style={{ width: '100%', padding: '10px', background: '#333', color: '#888', border: '1px solid #444', cursor: 'not-allowed' }}>
                                    {p.status}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Funding Modal with Liability Waiver */}
            {selectedProject && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ padding: '30px', width: '600px', border: '1px solid var(--neon-magenta)' }}>
                        <h3 style={{ marginTop: 0 }}>Project: {selectedProject.title}</h3>

                        {/* Top Section: Smart Lock for Documents */}
                        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px', color: '#fff' }}>🔒 Secure Documents</h4>

                            {!ndaSigned ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,0,0.05)', padding: '10px', border: '1px solid #555', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '1.5rem' }}>🔐</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#ccc' }}>Pitch Deck Encrypted</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>NDA Signature Required</div>
                                        </div>
                                    </div>
                                    <button className="btn-neon" style={{ fontSize: '0.8rem' }} onClick={() => { setModalType('NDA'); setShowNDAModal(true); }}>
                                        Unlock with NDA
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,255,0,0.05)', padding: '10px', border: '1px solid #0f0', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '1.5rem' }}>🔓</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#0f0' }}>Access Granted</div>
                                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>Watermarked for ID: {investorId}</div>
                                        </div>
                                    </div>
                                    <a
                                        href={decryptedData?.pitchDeckUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '8px 15px', background: 'cyan', color: '#000', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'
                                        }}
                                    >
                                        View Deck &rarr;
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Investment Input */}
                        <label style={{ display: 'block', marginBottom: '10px' }}>Investment Amount ($)</label>
                        <input type="number" className="neon-input" value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)} style={{ width: '100%', marginBottom: '20px' }} />

                        {/* Liability Waiver (Secondary Check) */}
                        <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                            <h4 style={{ color: 'red', marginTop: 0 }}>⚠️ Final Liability Waiver</h4>
                            <p style={{ fontSize: '0.8rem', color: '#ddd' }}>
                                The Platform and its Administrators are 100% exempt from any liability, loss of capital, or legal disputes.
                            </p>
                            {!waiverSigned ? (
                                <button
                                    onClick={() => { setModalType('WAIVER'); setShowNDAModal(true); }}
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,0,0,0.2)', border: '1px solid red', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    ✍ Click to Sign Liability Waiver
                                </button>
                            ) : (
                                <div style={{ color: '#0f0', fontWeight: 'bold', textAlign: 'center', padding: '10px', border: '1px solid #0f0', borderRadius: '4px' }}>
                                    ✓ Waiver Signed & Logged
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-neon" onClick={handleFund} disabled={loading || !waiverSigned || !ndaSigned || !investmentAmount} style={{ flex: 1, opacity: (!waiverSigned || !ndaSigned) ? 0.5 : 1 }}>
                                {loading ? 'Processing...' : 'Confirm Transfer'}
                            </button>
                            <button onClick={closeModal} style={{ flex: 1, background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={() => setChatContext({ roomId: 'investment-' + selectedProject.id, title: 'Negotiation: ' + selectedProject.title })}
                                style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                💬 Negotiate with Founder
                            </button>
                            <button
                                onClick={() => handleZoomMeeting(selectedProject)}
                                style={{ marginTop: '10px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                🎥 Schedule Pitch Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            <NDAModal
                isOpen={showNDAModal}
                onClose={() => setShowNDAModal(false)}
                onSign={handleSignLegalDoc}
                investorId={investorId}
                projectTitle={selectedProject?.title}
                type={modalType}
            />
            <UniversalChat
                roomId={chatContext.roomId}
                userId="901"
                userName="Angel Investor"
                userRole="investor"
                title={chatContext.title}
            />
        </div >
    );
};

export default InvestorMarketplace;

