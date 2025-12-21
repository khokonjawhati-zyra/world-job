
const RevenueDashboard = () => {
    // 1. Fetch live data (mocked via Service)
    const transactions = CommissionService.getRecentTransactions();

    // 2. Aggregate Totals
    const totals = transactions.reduce((acc, curr) => ({
        volume: acc.volume + curr.value,
        platformFee: acc.platformFee + curr.fee,
        adminRevenue: acc.adminRevenue + curr.admin,
        investorShare: acc.investorShare + curr.investorPool
    }), { volume: 0, platformFee: 0, adminRevenue: 0, investorShare: 0 });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Top Level Stats */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', background: 'linear-gradient(to right, rgba(10,10,20,0.9), rgba(30,30,50,0.9))' }}>
                <h2 style={{ marginBottom: '20px' }}>Real-Time Revenue Tracking</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <StatCard title="Total Job Volume" value={`$${totals.volume.toLocaleString()}`} color="#fff" subtitle="Gross Transaction Value" />
                    <StatCard title="Platform Commission (10%)" value={`$${totals.platformFee.toLocaleString()}`} color="var(--neon-purple)" subtitle="Total Fees Collected" />
                    <StatCard title="Net Admin Revenue (70%)" value={`$${totals.adminRevenue.toLocaleString()}`} color="var(--neon-lime)" subtitle="Operating Profit" />
                    <StatCard title="Investor Pool (30%)" value={`$${totals.investorShare.toLocaleString()}`} color="var(--neon-cyan)" subtitle="Distributed Advice" />
                </div>
            </div>

            {/* Detailed Split Visualization */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3>Commission Log</h3>
                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '15px' }}>Job</th>
                                <th>Value</th>
                                <th style={{ color: 'var(--neon-purple)' }}>Fee (10%)</th>
                                <th style={{ color: 'var(--neon-lime)' }}>Admin (70%)</th>
                                <th style={{ color: 'var(--neon-cyan)' }}>Investor (30%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{tx.project}</td>
                                    <td>${tx.value}</td>
                                    <td style={{ color: 'var(--neon-purple)' }}>${tx.fee}</td>
                                    <td style={{ color: 'var(--neon-lime)' }}>${tx.admin}</td>
                                    <td style={{ color: 'var(--neon-cyan)' }}>${tx.investorPool}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                    <h3>Escrow Logic Explained</h3>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Trigger</small>
                            <p>Job Marked "Complete"</p>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>↓</div>
                        <div style={{ padding: '15px', background: 'rgba(255,0,255,0.1)', border: '1px solid var(--neon-purple)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--neon-purple)' }}>System Action</small>
                            <p>Deduct 10% Fee</p>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>↓</div>
                        <div style={{ padding: '15px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--neon-lime)', borderRadius: '10px' }}>
                            <small style={{ color: 'var(--neon-lime)' }}>Worker Receive</small>
                            <p>90% Net Payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
