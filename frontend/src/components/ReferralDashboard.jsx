import React from 'react';

const ReferralDashboard = ({ user }) => {
    const referralLink = `${window.location.origin}/auth?ref=${user.referralCode || 'UNKNOWN'}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral Link Copied!');
    };

    const shareOnSocial = (platform) => {
        let url = '';
        const text = `Join World Job Market using my referral code: ${user.referralCode}!`;
        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
        } else if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        } else if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`;
        }
        window.open(url, '_blank');
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'gold', marginBottom: '20px' }}>
                🎁 Refer & Earn Program
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '15px', border: '1px solid gold', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'gold' }}>${user.referralEarnings || 0}</div>
                        <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Total Earnings</div>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(0,255,255,0.1)', borderRadius: '15px', border: '1px solid cyan', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'cyan' }}>{user.referralCount || 0}</div>
                        <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Successful Refers</div>
                    </div>
                </div>

                {/* Code & Sosh */}
                <div>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Your Unique Referral Link</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            readOnly
                            value={referralLink}
                            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #444', background: '#111', color: 'lime', fontFamily: 'monospace' }}
                        />
                        <button onClick={copyToClipboard} className="btn-neon" style={{ padding: '10px 20px' }}>Copy</button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => shareOnSocial('twitter')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#1DA1F2', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Twitter</button>
                        <button onClick={() => shareOnSocial('facebook')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#4267B2', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Facebook</button>
                        <button onClick={() => shareOnSocial('whatsapp')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>WhatsApp</button>
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                <h4>How it works</h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#aaa', marginTop: '10px' }}>
                    <li>Share your unique link with friends and colleagues.</li>
                    <li>When they sign up and complete their first transaction (Project Funding or Investment), you get rewarded.</li>
                    <li>Referral rewards are automatically credited to your wallet balance.</li>
                    <li>Anti-fraud systems analyze activity to ensure genuine growth.</li>
                </ul>
            </div>
        </div>
    );
};

export default ReferralDashboard;
