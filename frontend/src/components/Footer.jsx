import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '20px',
            marginTop: '40px',
            textAlign: 'center',
            color: '#666',
            fontSize: '0.9rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ marginBottom: '10px' }}>
                <span className="text-gradient">W🌎RLD J🌎B MARKET</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>© {new Date().getFullYear()} All Rights Reserved</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <a href="/terms" target="_blank" style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}>Terms & Conditions</a>
                <a href="/privacy" target="_blank" style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="/gdpr" target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GDPR Compliance</a>
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.7em', maxWidth: '600px', margin: '10px auto 0' }}>
                Disclaimer: The Admin/Platform is a facilitator only. Users accept all financial and project risks. Admin holds no liability for losses or disputes.
            </p>
        </footer>
    );
};

export default Footer;
