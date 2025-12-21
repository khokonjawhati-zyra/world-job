
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AdminFinancialOversight = () => {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = () => {
        fetch('${API_BASE_URL}/payment/admin/methods')
            .then(res => res.json())
            .then(data => {
                setMethods(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const toggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        fetch(`${API_BASE_URL}/payment/admin/method/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(`Method ${newStatus.toUpperCase()}`);
                    fetchMethods(); // Refresh
                }
            });
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Payment Method Oversight</h2>
                <button onClick={fetchMethods} className="btn-neon">Refresh</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>User ID</th>
                                <th>Method Type</th>
                                <th>Details</th>
                                <th>Currency</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {methods.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No Payment Methods Found</td></tr>
                            ) : methods.map(m => (
                                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{m.userId}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{m.type}</td>
                                    <td>{m.type === 'stripe' ? `**** ${m.details.last4}` : m.details.phoneNumber}</td>
                                    <td>{m.currency}</td>
                                    <td style={{ color: m.status === 'active' ? 'var(--neon-green)' : 'red' }}>
                                        {m.status.toUpperCase()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleStatus(m.id, m.status)}
                                            style={{
                                                border: '1px solid',
                                                borderColor: m.status === 'active' ? 'red' : 'var(--neon-green)',
                                                background: 'transparent',
                                                color: m.status === 'active' ? 'red' : 'var(--neon-green)',
                                                borderRadius: '5px',
                                                padding: '5px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {m.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Global Controls */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                <div>
                    <h3 style={{ marginBottom: '20px' }}>Global Payment Controls</h3>
                    <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                        <GlobalToggle type="stripe" label="Stripe / Card" />
                        <GlobalToggle type="bkash" label="bKash / Mobile" />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '20px' }}>Admin Transaction Console</h3>
                    <AdminTransactionConsole />
                </div>

                <div>
                    {/* <h3 style={{ marginBottom: '20px' }}>Referral Settings</h3> Is inside component */}
                    <ReferralSettingsPanel />
                </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ marginBottom: '20px' }}>Pending Withdrawal Requests</h3>
                <AdminWithdrawalPanel />
            </div>
        </div>
    );
};

const GlobalToggle = ({ type, label }) => {
    const [enabled, setEnabled] = useState(true); // Default true for UI, fetching state ideal

    const handleToggle = () => {
        const newState = !enabled;
        if (!window.confirm(`Are you sure you want to ${newState ? 'ENABLE' : 'DISABLE'} ${label} globally?`)) return;

        setEnabled(newState); // Optimistic UI
        fetch('${API_BASE_URL}/payment/admin/global/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, enabled: newState })
        })
            .then(res => res.json())
            .then(data => alert(data.message));
    };

    return (
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', flex: 1 }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>{label}</div>
            <button
                onClick={handleToggle}
                className={enabled ? 'btn-neon' : ''}
                style={{
                    width: '100%',
                    background: enabled ? 'var(--neon-green)' : 'red',
                    color: enabled ? '#000' : '#fff',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {enabled ? 'ENABLED' : 'DISABLED'}
            </button>
        </div>
    );
};

const AdminTransactionConsole = () => {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('deposit'); // 'deposit' or 'withdraw'
    const [currency, setCurrency] = useState('USD');
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (!userId || !amount || !reason) return alert("Please fill all fields");

        // Map mode to backend 'type'
        const type = mode === 'deposit' ? 'add' : 'subtract';

        fetch('${API_BASE_URL}/payment/admin/balance/adjust', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount: parseFloat(amount), type, currency, reason })
        })
            .then(res => res.json())
            .then(data => {
                alert(`${mode === 'deposit' ? 'Deposit' : 'Withdrawal'} Successful!`);
                setUserId(''); setAmount(''); setReason('');
            })
            .catch(err => alert("Transaction Failed: " + err.message));
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', marginBottom: '15px', background: '#222', borderRadius: '5px', padding: '2px' }}>
                <button
                    onClick={() => setMode('deposit')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: mode === 'deposit' ? 'var(--neon-green)' : 'transparent',
                        color: mode === 'deposit' ? '#000' : '#888',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    + Deposit (Credit)
                </button>
                <button
                    onClick={() => setMode('withdraw')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: mode === 'withdraw' ? 'var(--neon-pink)' : 'transparent',
                        color: mode === 'withdraw' ? '#fff' : '#888',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    - Withdraw (Debit)
                </button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                <input
                    placeholder="Target User ID"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
                    />
                    <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        style={{ padding: '12px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}
                    >
                        <option value="USD">USD</option>
                        <option value="BDT">BDT</option>
                    </select>
                </div>

                <textarea
                    placeholder="Reference / Reason / Admin Note..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: '#fff', borderRadius: '5px', minHeight: '80px', fontFamily: 'inherit' }}
                />

                <button
                    onClick={handleSubmit}
                    className="btn-neon"
                    style={{
                        width: '100%',
                        marginTop: '10px',
                        background: mode === 'deposit' ? 'var(--neon-green)' : 'var(--neon-pink)',
                        color: mode === 'deposit' ? '#000' : '#fff'
                    }}
                >
                    Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </button>
            </div>
        </div>
    );
};


const AdminWithdrawalPanel = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        fetch('${API_BASE_URL}/payment/admin/withdrawals')
            .then(res => res.json())
            .then(data => {
                // Client-side filtering because backend returns all history
                const pending = data.filter(r => r.status === 'PENDING');
                setRequests(pending);
            })
            .catch(console.error);
    };

    const handleAction = async (id, action) => {
        const note = prompt("Admin Note (Optional):") || ""; // Default to empty string if cancelled

        try {
            const res = await fetch(`${API_BASE_URL}/payment/admin/withdrawal/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, note })
            });

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            if (data.success) {
                alert(`Request ${action.toUpperCase()}D successfully!`);
                fetchRequests();
            } else {
                alert("Action failed: " + (data.message || "Unknown error"));
            }
        } catch (e) {
            console.error("Withdrawal Action Error:", e);
            alert("Error processing request: " + e.message);
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Date</th>
                        <th>User ID</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No pending requests</td></tr>
                    ) : requests.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>{new Date(r.date).toLocaleDateString()}</td>
                            <td>{r.userId}</td>
                            <td style={{ fontWeight: 'bold', color: '#fff' }}>{r.amount} {r.currency}</td>
                            <td>
                                {r.details && r.details.phoneNumber ? `bKash (${r.details.phoneNumber})` : `Stripe (****)`}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleAction(r.id, 'approve')}
                                    style={{ background: 'var(--neon-green)', color: '#000', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '10px', cursor: 'pointer' }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(r.id, 'reject')}
                                    style={{ background: 'transparent', border: '1px solid red', color: 'red', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ReferralSettingsPanel = () => {
    const [settings, setSettings] = useState({ enabled: true, type: 'FIXED', value: 5.00 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('${API_BASE_URL}/payment/admin/referral-settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleSave = () => {
        fetch('${API_BASE_URL}/payment/admin/referral-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                alert("Referral Settings Saved!");
                setSettings(data);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to save settings: " + err.message);
            });
    };

    if (loading) return <div>Loading Settings...</div>;

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'gold' }}>Referral Program 🎁</h3>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                    <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Reward Type</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setSettings({ ...settings, type: 'FIXED' })}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid gold', cursor: 'pointer',
                                background: settings.type === 'FIXED' ? 'rgba(255,215,0,0.2)' : 'transparent',
                                color: settings.type === 'FIXED' ? 'gold' : '#888'
                            }}
                        >
                            Fixed Amount ($)
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, type: 'PERCENTAGE' })}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid gold', cursor: 'pointer',
                                background: settings.type === 'PERCENTAGE' ? 'rgba(255,215,0,0.2)' : 'transparent',
                                color: settings.type === 'PERCENTAGE' ? 'gold' : '#888'
                            }}
                        >
                            Percentage (%)
                        </button>
                    </div>
                </div>

                <div>
                    <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Reward Value</label>
                    <input
                        type="number"
                        value={settings.value}
                        onChange={e => setSettings({ ...settings, value: parseFloat(e.target.value) })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #555', borderRadius: '5px', color: 'gold', fontWeight: 'bold' }}
                    />
                </div>

                <div style={{ padding: '10px', background: 'rgba(255,215,0,0.05)', borderRadius: '5px', fontSize: '0.8rem', color: '#aaa' }}>
                    {settings.type === 'FIXED'
                        ? `Referrer gets $${settings.value} when the new user spends their first money.`
                        : `Referrer gets ${settings.value}% of the new user's first transaction amount.`}
                </div>

                <button onClick={handleSave} className="btn-neon" style={{ marginTop: '10px', borderColor: 'gold', color: 'gold' }}>Save Configuration</button>
            </div>
        </div>
    );
};

export default AdminFinancialOversight;

