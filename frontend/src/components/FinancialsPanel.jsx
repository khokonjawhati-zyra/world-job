import React, { useState, useEffect } from 'react';
import CurrencyExchangePanel from './CurrencyExchangePanel';

const FinancialsPanel = ({ userId, role }) => {
    const [methods, setMethods] = useState([]);
    const [gateways, setGateways] = useState([]); // State for System Gateways
    const [loading, setLoading] = useState(true);
    const [newMethod, setNewMethod] = useState({ category: 'intl', type: 'stripe', details: '', currency: 'USD' });
    const [history, setHistory] = useState([]);
    const [balance, setBalance] = useState({ USD: 0, BDT: 0 });

    useEffect(() => {
        fetchMethods();
        fetchTransactions();
        fetchGateways(); // Fetch Admin Gateways
    }, [userId]);

    const fetchTransactions = () => {
        fetch(`http://localhost:3001/payment/transactions/${userId}`)
            .then(res => res.json())
            .then(data => {
                setHistory(data.history || []);
                setBalance({ ...data.balance, locked: data.locked } || { USD: 0, BDT: 0 });
            })
            .catch(console.error);
    };

    const fetchMethods = () => {
        fetch(`http://localhost:3001/payment/methods/${userId}`)
            .then(res => res.json())
            .then(data => {
                setMethods(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchGateways = () => {
        fetch('http://localhost:3001/payment/admin/gateways')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setGateways(data);
                }
            })
            .catch(err => console.error("Failed to fetch gateways", err));
    };

    const handleAddMethod = () => {
        if (!newMethod.details.trim()) {
            return alert("Please enter payment details (Card Number or Phone)");
        }

        const details = newMethod.type === 'stripe'
            ? { last4: newMethod.details.slice(-4), brand: 'Visa' }
            : (newMethod.type === 'bkash' || newMethod.type === 'nagad' || newMethod.type === 'rocket')
                ? { phoneNumber: newMethod.details, provider: newMethod.type }
                : (newMethod.type === 'usdt')
                    ? { walletAddress: newMethod.details, network: 'TRC20' }
                    : { identifier: newMethod.details };

        const payload = {
            type: newMethod.type,
            details,
            currency: newMethod.currency
        };

        console.log("Sending Payload:", payload);

        fetch(`http://localhost:3001/payment/methods/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || res.statusText);
                }
                return res.json();
            })
            .then(data => {
                console.log("Response Data:", data);
                if (data && data.id) {
                    setMethods(prev => [...prev, data]);
                    setNewMethod({ ...newMethod, details: '' });
                    alert('Method Added Successfully');
                } else {
                    alert("Server returned invalid data");
                }
            })
            .catch(err => {
                console.error("Add Method Error:", err);
                alert('Failed to add method: ' + err.message);
            });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>{role === 'worker' ? 'Payout Methods' : 'Payment Methods'}</h3>

                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {methods.map((m, idx) => (
                                <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{m.type} {m.isPrimary && <span style={{ fontSize: '0.8rem', background: 'var(--neon-green)', color: '#000', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px' }}>Primary</span>}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {m.type === 'stripe' ? `**** **** **** ${m.details.last4}` : m.details.phoneNumber}
                                        </div>
                                    </div>
                                    <div style={{ color: m.status === 'active' ? 'var(--neon-green)' : 'red' }}>{m.status}</div>
                                </div>
                            ))}
                        </div>
                    )}


                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4>Add Global or Local Method</h4>

                        {/* Gateway Category Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', marginTop: '10px' }}>
                            {['intl', 'local', 'crypto'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setNewMethod({ ...newMethod, category: tab, type: tab === 'crypto' ? 'usdt' : (tab === 'local' ? 'bkash' : 'stripe') })}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: '8px',
                                        border: newMethod.category === tab ? '1px solid var(--neon-cyan)' : '1px solid #333',
                                        background: newMethod.category === tab ? 'rgba(0,255,255,0.1)' : 'transparent',
                                        color: newMethod.category === tab ? 'var(--neon-cyan)' : '#888',
                                        cursor: 'pointer', textTransform: 'capitalize'
                                    }}
                                >
                                    {tab === 'intl' ? 'International' : (tab === 'local' ? 'Local (BD)' : 'Crypto')}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gap: '10px' }}>
                            {/* Dynamic Type Select based on Category */}
                            <select
                                value={newMethod.type}
                                onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '5px' }}
                            >
                                {newMethod.category === 'intl' && (
                                    <>
                                        <option value="stripe">Stripe (Visa/Mastercard)</option>
                                        <option value="paypal">PayPal</option>
                                    </>
                                )}
                                {newMethod.category === 'local' && (
                                    <>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                    </>
                                )}
                                {newMethod.category === 'crypto' && (
                                    <>
                                        <option value="usdt">USDT (Tether)</option>
                                        <option value="btc">Bitcoin</option>
                                    </>
                                )}
                            </select>

                            <input
                                type="text"
                                placeholder={
                                    newMethod.category === 'intl' ? (newMethod.type === 'paypal' ? "PayPal Email" : "Card Number") :
                                        newMethod.category === 'crypto' ? "Wallet Address" : "Mobile Number"
                                }
                                value={newMethod.details}
                                onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                            />

                            <select
                                value={newMethod.currency}
                                onChange={(e) => setNewMethod({ ...newMethod, currency: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '5px' }}
                            >
                                <option style={{ color: '#000' }} value="USD">USD</option>
                                <option style={{ color: '#000' }} value="BDT">BDT</option>
                                <option style={{ color: '#000' }} value="EUR">EUR</option>
                            </select>

                            <button onClick={handleAddMethod} className="btn-neon" style={{ marginTop: '10px' }}>
                                {loading ? 'Linking...' : 'Link Method'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Deposit Section added for Workers */}
                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', marginTop: '20px' }}>
                    <DepositForm userId={userId} methods={methods} gateways={gateways} onSuccess={fetchTransactions} />
                </div>
            </div>

            <div>
                {/* Transaction Manager */}
                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>{role === 'employer' ? 'Manage Funds' : 'Payouts'}</h3>

                    {/* Balance Display */}
                    <div style={{ padding: '15px', background: 'var(--neon-blue-glass)', borderRadius: '10px', marginBottom: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>Current Balance</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                            ${balance?.USD?.toFixed(2) || '0.00'} / ৳{balance?.BDT?.toFixed(2) || '0.00'}
                        </div>
                        {balance?.locked?.USD > 0 && (
                            <div style={{ fontSize: '0.9rem', color: 'orange', marginTop: '5px' }}>
                                🔒 Locked in Escrow: ${balance.locked.USD.toFixed(2)}
                            </div>
                        )}
                    </div>

                    {role === 'employer' ? (
                        <DepositForm userId={userId} methods={methods} gateways={gateways} onSuccess={fetchTransactions} />
                    ) : (
                        <WithdrawForm userId={userId} methods={methods} onSuccess={fetchTransactions} />
                    )}
                </div>

                {/* Transaction History */}
                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Transaction History</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {history.length > 0 ? history.map(tx => (
                            <div key={tx.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{tx.type.replace(/_/g, ' ')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(tx.timestamp || tx.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ color: tx.flow === 'IN' ? 'var(--neon-green)' : 'red' }}>
                                    {tx.flow === 'IN' ? '+' : '-'}{tx.amount} {tx.currency}
                                </div>
                            </div>

                        )) : <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No transactions</div>}
                    </div>
                </div>

                {/* New Currency Exchange Panel */}
                <CurrencyExchangePanel userId={userId} />
            </div>
        </div>
    );
};

const DepositForm = ({ userId, methods, gateways = [], onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [methodId, setMethodId] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);

    const handleDeposit = () => {
        if (!amount || !methodId) return alert("Select method and amount");
        setLoading(true);
        fetch('http://localhost:3001/payment/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount: parseFloat(amount), methodId, currency })
        })
            .then(res => res.json())
            .then(data => {
                alert("Deposit Successful!");
                setAmount('');
                if (onSuccess) onSuccess();
            })
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <h4>Deposit Funds</h4>
            <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                />
                <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '5px' }}
                >
                    <option style={{ color: '#000' }} value="USD">USD</option>
                    <option style={{ color: '#000' }} value="BDT">BDT</option>
                </select>
                <select
                    value={methodId}
                    onChange={e => setMethodId(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '5px' }}
                >
                    <option style={{ color: '#000' }} value="" disabled>Select Method</option>
                    {methods.map(m => <option style={{ color: '#000' }} key={m.id} value={m.id}>Saved: {m.type} - {m.currency}</option>)}
                    {gateways.length > 0 && <option disabled style={{ color: '#666' }}>-- System Gateways --</option>}
                    {gateways.map(g => <option style={{ color: '#000' }} key={g.id} value={g.id}>{g.name} ({g.type})</option>)}
                </select>
                <button onClick={handleDeposit} disabled={loading} className="btn-neon" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Processing...' : 'Deposit Now'}
                </button>
            </div>
        </div>
    );
};

const WithdrawForm = ({ userId, methods, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [methodId, setMethodId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleWithdraw = () => {
        if (!amount || !methodId) return alert("Select method and amount");
        setLoading(true);
        fetch('http://localhost:3001/payment/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount: parseFloat(amount), methodId, currency: 'USD' })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                setAmount('');
                if (onSuccess) onSuccess();
            })
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <h4>Request Withdrawal</h4>
            <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                <input
                    type="number"
                    placeholder="Amount ($)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                />
                <select
                    value={methodId}
                    onChange={e => setMethodId(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '5px' }}
                >
                    <option style={{ color: '#000' }} value="">Select Payout Method</option>
                    {methods.map(m => <option style={{ color: '#000' }} key={m.id} value={m.id}>{m.type}</option>)}
                </select>
                <button onClick={handleWithdraw} disabled={loading} className="btn-neon" style={{ borderColor: 'orange', color: 'orange', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Requesting...' : 'Request Payout'}
                </button>
            </div>
        </div>
    );
};

export default FinancialsPanel;
