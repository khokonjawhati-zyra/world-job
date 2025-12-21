import React, { useState, useEffect } from 'react';

const CurrencyExchangePanel = ({ userId = '201', userRole = 'BUYER' }) => {
    const API_URL = 'https://world-job-backend.vercel.app';
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('BDT');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState({});

    // Fetch live balances
    const fetchBalances = async () => {
        try {
            const res = await fetch(`${API_URL}/payment/transactions/${userId}`);
            const data = await res.json();
            setBalances(data.balance || {});
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, [userId]);

    const handleCalculate = async () => {
        try {
            const res = await fetch(`${API_URL}/payment/exchange-rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, from: fromCurrency, to: toCurrency })
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExchange = async () => {
        // Removed confirm dialog for better UX
        // if (!confirm(`Confirm exchange of ${amount} ${fromCurrency} to ${toCurrency}?`)) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/payment/exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount: parseFloat(amount), from: fromCurrency, to: toCurrency })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Exchange Successful! You received ${Number(data.converted).toFixed(2)} ${toCurrency}`);
                fetchBalances(); // Refresh balances
                setAmount(''); // Reset amount
            } else {
                alert('Exchange Failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Exchange failed: Network or Server Error');
        } finally {
            setLoading(false);
        }
    };

    // Auto-calculate when inputs change
    useEffect(() => {
        if (amount > 0) handleCalculate();
    }, [amount, fromCurrency, toCurrency]);

    const currencies = ['USD', 'BDT', 'EUR'];

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '24px'
        }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💱 Global Currency Exchange
            </h3>

            {/* Balance Display */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>USD Available</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700' }}>${balances['USD']?.toLocaleString() || '0.00'}</p>
                </div>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>BDT Available</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700' }}>৳{balances['BDT']?.toLocaleString() || '0.00'}</p>
                </div>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>EUR Available</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700' }}>€{balances['EUR']?.toLocaleString() || '0.00'}</p>
                </div>
            </div>

            {/* Converter UI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* From Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#cbd5e1' }}>Send Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '16px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#cbd5e1' }}>Currency</label>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '16px' }}
                        >
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Arrow Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0' }}>
                    <div style={{ backgroundColor: '#3b82f6', padding: '6px', borderRadius: '50%', color: 'white', fontSize: '14px' }}>↓</div>
                </div>

                {/* To Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#cbd5e1' }}>Received Amount (Est.)</label>
                        <input
                            type="text"
                            value={result?.converted ? result.converted.toFixed(2) : '...'}
                            readOnly
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#818cf8', fontSize: '16px', fontWeight: '600' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#cbd5e1' }}>Currency</label>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '16px' }}
                        >
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Exchange Rate Badge */}
                {result?.rate && (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                        Exchange Rate: 1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleExchange}
                    disabled={loading || amount <= 0 || Number(amount) > Number(balances[fromCurrency] || 0)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: (Number(amount) > Number(balances[fromCurrency] || 0)) ? '#ef4444' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (loading || Number(amount) > Number(balances[fromCurrency] || 0)) ? 'not-allowed' : 'pointer',
                        marginTop: '12px',
                        transition: 'background 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={e => !loading && Number(amount) <= Number(balances[fromCurrency] || 0) && (e.target.style.backgroundColor = '#2563eb')}
                    onMouseLeave={e => !loading && Number(amount) <= Number(balances[fromCurrency] || 0) && (e.target.style.backgroundColor = '#3b82f6')}
                >
                    {loading ? 'Processing Exchange...' :
                        (Number(amount) > Number(balances[fromCurrency] || 0)) ? `Insufficient ${fromCurrency} Balance` :
                            `Convert Now (${fromCurrency} → ${toCurrency})`}
                </button>

            </div>
        </div>
    );
};

export default CurrencyExchangePanel;
