
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import CurrencyExchangePanel from './CurrencyExchangePanel';

const FinancialServicesPanel = () => {
    const [activeTab, setActiveTab] = useState('billing');
    const [stats, setStats] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use centralized config
    const API_URL = API_BASE_URL;

    useEffect(() => {
        console.log("FinancialPanel: Mounting and loading data from", API_URL);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        console.log("FinancialPanel: Starting loadData...");
        try {
            await Promise.all([fetchInvoices(), fetchPayouts(), fetchReport()]);
            setError(null);
            console.log("FinancialPanel: Data loaded successfully");
        } catch (err) {
            console.error("FinancialPanel Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        try {
            console.log(`Fetching: ${API_URL}/financial/invoices`);
            const res = await fetch(`${API_URL}/financial/invoices`, { mode: 'cors' });
            if (!res.ok) throw new Error(`Invoices failed: ${res.status} ${res.statusText}`);
            const data = await res.json();
            setInvoices(data);
        } catch (err) {
            console.warn("Backend unreached, using mock invoices:", err);
            setInvoices([
                { id: 'INV-1001', userId: '201', userType: 'EMPLOYER', transactionId: 'TRX-9981', amount: 1200, currency: 'USD', date: '2025-12-01', status: 'PAID', items: ['React App Development'] },
                { id: 'INV-1002', userId: '202', userType: 'EMPLOYER', transactionId: 'TRX-9985', amount: 500, currency: 'USD', date: '2025-12-05', status: 'PAID', items: ['Logo Design'] }
            ]);
        }
    };

    const fetchPayouts = async () => {
        try {
            const res = await fetch(`${API_URL}/financial/payouts`);
            if (!res.ok) throw new Error('Failed to fetch payouts');
            const data = await res.json();
            setPayouts(data);
        } catch (err) {
            console.warn("Backend unreached, using mock payouts:", err);
            setPayouts([
                { id: 'PO-5001', workerId: '101', amount: 1080, currency: 'USD', method: 'STRIPE', status: 'COMPLETED', date: '2025-12-03' }
            ]);
        }
    };

    const fetchReport = async () => {
        try {
            const res = await fetch(`${API_URL}/financial/report?period=2025-Q4`);
            if (!res.ok) throw new Error('Failed to fetch report');
            const data = await res.json();
            setReport(data);
        } catch (err) {
            console.warn("Backend unreached, using mock report:", err);
            setReport({
                revenue: 120000,
                expenses: 15000,
                netProfit: 20000,
                totalPayouts: 85000,
                platformFees: 12000
            });
        }
    };

    const handlePayout = async (workerId) => {
        try {
            await fetch(`${API_URL}/financial/payout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workerId,
                    amount: 500, // Hardcoded for demo
                    method: 'STRIPE'
                })
            });
            alert('Payout Processing via Stripe');
            fetchPayouts();
        } catch (e) { console.error(e); }
    };

    const renderBilling = () => (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Automated Billing Center</h3>
                <button className="btn-neon">Generate New Invoice</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                        <th style={{ padding: '10px' }}>Inv ID</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px 10px' }}>{inv.id}</td>
                            <td>{inv.userType} #{inv.userId}</td>
                            <td style={{ color: '#fff' }}>${inv.amount.toLocaleString()}</td>
                            <td>
                                <span style={{
                                    padding: '5px 10px', borderRadius: '5px',
                                    background: inv.status === 'PAID' ? 'rgba(0,255,0,0.1)' : 'rgba(255,165,0,0.1)',
                                    color: inv.status === 'PAID' ? 'var(--neon-lime)' : 'orange'
                                }}>{inv.status}</span>
                            </td>
                            <td>{new Date(inv.date).toLocaleDateString()}</td>
                            <td><button style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}>Download PDF</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPayouts = () => (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Global Payout Management</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ padding: '5px 10px', background: 'rgba(100,50,255,0.2)', color: '#a0a', borderRadius: '5px' }}>Stripe Connected</span>
                    <span style={{ padding: '5px 10px', background: 'rgba(255,0,100,0.2)', color: '#f06', borderRadius: '5px' }}>Bkash Active</span>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                        <th style={{ padding: '10px' }}>Payout ID</th>
                        <th>Worker</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payouts.map(po => (
                        <tr key={po.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px 10px' }}>{po.id}</td>
                            <td>Worker #{po.workerId}</td>
                            <td>{po.method}</td>
                            <td style={{ color: '#fff' }}>${po.amount.toLocaleString()}</td>
                            <td>
                                <span style={{
                                    padding: '5px 10px', borderRadius: '5px',
                                    background: po.status === 'COMPLETED' ? 'rgba(0,255,0,0.1)' : 'rgba(100,100,255,0.1)',
                                    color: po.status === 'COMPLETED' ? 'var(--neon-lime)' : 'var(--neon-cyan)'
                                }}>{po.status}</span>
                            </td>
                            <td>{new Date(po.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <h4>Test Payout Integration</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handlePayout('101')} className="btn-neon">Process Test Payout ($500)</button>
                </div>
            </div>
        </div>
    );

    const renderReports = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Financial Statement (2025-Q4)</h3>
                    <button className="btn-neon">Export CSV</button>
                </div>
                {report && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
                            <h2 style={{ color: '#fff' }}>${report.revenue.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Platform Fees</p>
                            <h2 style={{ color: 'var(--neon-purple)' }}>${report.platformFees.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Worker Payouts</p>
                            <h2 style={{ color: 'var(--neon-cyan)' }}>${report.totalPayouts.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(0,255,0,0.1)', borderRadius: '10px', border: '1px solid var(--neon-lime)' }}>
                            <p style={{ color: 'var(--neon-lime)' }}>Net Profit</p>
                            <h2 style={{ color: 'var(--neon-lime)' }}>${report.netProfit.toLocaleString()}</h2>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <h3>Profit & Loss (P&L)</h3>
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>Service Revenue</span>
                        <span>$120,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>Cost of Revenue (Payouts)</span>
                        <span style={{ color: 'var(--neon-pink)' }}>($85,000)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>OpEx (Server, API)</span>
                        <span style={{ color: 'var(--neon-pink)' }}>($15,000)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '10px', fontWeight: 'bold' }}>
                        <span>Net Income</span>
                        <span style={{ color: 'var(--neon-lime)' }}>$20,000</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="glass-panel" style={{ padding: '20px' }}>Loading Financial Data...</div>;
    if (error) return <div className="glass-panel" style={{ padding: '20px', color: 'var(--neon-pink)' }}>
        <strong>Error Loading Financials:</strong> {error}
        <br /><br />
        <small style={{ color: '#ccc' }}>Check if Backend (Port 3001) is running and CORS is enabled.</small>
        <br /><br />
        <button onClick={loadData} className="btn-neon">Retry Connection</button>
    </div>;

    return (
        <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('billing')} style={{ background: 'none', border: 'none', color: activeTab === 'billing' ? 'var(--neon-cyan)' : 'var(--text-muted)', borderBottom: activeTab === 'billing' ? '2px solid var(--neon-cyan)' : '2px solid transparent', cursor: 'pointer', paddingBottom: '5px' }}>Automated Billing</button>
                <button onClick={() => setActiveTab('payouts')} style={{ background: 'none', border: 'none', color: activeTab === 'payouts' ? 'var(--neon-cyan)' : 'var(--text-muted)', borderBottom: activeTab === 'payouts' ? '2px solid var(--neon-cyan)' : '2px solid transparent', cursor: 'pointer', paddingBottom: '5px' }}>Payout Management</button>
                <button onClick={() => setActiveTab('reports')} style={{ background: 'none', border: 'none', color: activeTab === 'reports' ? 'var(--neon-cyan)' : 'var(--text-muted)', borderBottom: activeTab === 'reports' ? '2px solid var(--neon-cyan)' : '2px solid transparent', cursor: 'pointer', paddingBottom: '5px' }}>Financial Reporting</button>
                <button onClick={() => setActiveTab('exchange')} style={{ background: 'none', border: 'none', color: activeTab === 'exchange' ? 'var(--neon-cyan)' : 'var(--text-muted)', borderBottom: activeTab === 'exchange' ? '2px solid var(--neon-cyan)' : '2px solid transparent', cursor: 'pointer', paddingBottom: '5px' }}>Currency Exchange</button>
            </div>

            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'payouts' && renderPayouts()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'exchange' && <CurrencyExchangePanel userId="wallet_admin_main" userRole="ADMIN" />}
        </div>
    );
};

export default FinancialServicesPanel;
