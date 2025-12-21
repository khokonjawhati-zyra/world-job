import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const TermsPage = () => {
    const [terms, setTerms] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/settings/terms')
            .then(res => res.json())
            .then(data => {
                setTerms(data.text);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px', paddingBottom: '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Logo />
                    </Link>
                    <Link to="/" className="btn-neon" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '8px 20px' }}>
                        Home
                    </Link>
                </header>

                <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(90deg, #fff, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms and Conditions</h1>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading Terms...</div>
                    ) : (
                        <div
                            style={{ lineHeight: '1.8', color: '#ddd' }}
                            dangerouslySetInnerHTML={{ __html: terms || '<p>No terms available.</p>' }}
                        />
                    )}
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Effective Date: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsPage;
