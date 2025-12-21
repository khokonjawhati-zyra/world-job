
import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const InvestorPortfolio = ({ investorId = "901" }) => {
    // Mock Data for Charts
    const roiData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Portfolio Growth (%)',
            data: [10, 15, 25, 30, 45, 60],
            borderColor: 'cyan',
            tension: 0.4
        }]
    };

    const allocationData = {
        labels: ['Tech Startups', 'Design Studios', 'Service Corps', 'Micro-Tasks'],
        datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: ['#00ffff', '#0099ff', '#ff00ff', '#ffff00']
        }]
    };

    return (
        <div style={{ color: '#fff' }}>
            <h2 className="text-gradient">📊 Investment Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ color: 'cyan' }}>+142%</h3>
                    <p>Total Yield (YTD)</p>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ color: '#0f0' }}>$24,500</h3>
                    <p>Active Capital Deployed</p>
                </div>
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ color: 'gold' }}>$3,200</h3>
                    <p>Dividends Earned</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>ROI History</h3>
                    <Line data={roiData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#333' } }, x: { grid: { display: false } } } }} />
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Allocation</h3>
                    <Pie data={allocationData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '20px', padding: '20px' }}>
                <h3>🏆 Your Top Performers</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: '#888', borderBottom: '1px solid #333' }}>
                            <th style={{ padding: '10px' }}>Project</th>
                            <th>Date Invested</th>
                            <th>Status</th>
                            <th>Return</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #222' }}>
                            <td style={{ padding: '10px' }}>Cyber-Cafe Renovation</td>
                            <td>Jan 12, 2024</td>
                            <td style={{ color: '#0f0' }}>Active</td>
                            <td style={{ color: 'cyan' }}>+12%</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px' }}>AI Content Agency</td>
                            <td>Feb 28, 2024</td>
                            <td style={{ color: '#0f0' }}>Active</td>
                            <td style={{ color: 'cyan' }}>+8.5%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvestorPortfolio;
