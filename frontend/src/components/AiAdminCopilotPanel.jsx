import React, { useState, useEffect } from 'react';

const AiAdminCopilotPanel = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/ai-admin/priority-queue')
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    const runAnalysis = (task) => {
        setAnalysis({ loading: true });
        const endpoint = task.type === 'PAYMENT_RELEASE'
            ? `http://localhost:3001/ai-admin/analyze/payment/${task.id}`
            : `http://localhost:3001/ai-admin/analyze/dispute/${task.id}`;

        fetch(endpoint, { method: 'POST' })
            .then(res => res.json())
            .then(data => setAnalysis(data))
            .catch(err => setAnalysis({ error: err.message }));
    };

    return (
        <div style={{ padding: '20px', background: '#1a1a2e', borderRadius: '15px', border: '1px solid #16213e', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '12px', height: '12px', background: 'cyan', borderRadius: '50%', boxShadow: '0 0 10px cyan' }}></div>
                <h2 style={{ margin: 0, background: 'linear-gradient(90deg, cyan, #e94560)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Admin Co-Pilot
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Priority Queue */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                    <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>Priority Workload</h4>
                    {loading ? <div>Analyzing workload...</div> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {tasks.map(task => (
                                <div key={task.id} style={{
                                    padding: '10px',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '5px',
                                    borderLeft: `4px solid ${task.severity === 'CRITICAL' ? 'red' : task.severity === 'HIGH' ? 'orange' : 'green'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{task.type.replace('_', ' ')}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{task.timePending}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'cyan' }}>
                                        🤖 Suggestion: {task.aiSuggestion}
                                    </div>
                                    <button
                                        onClick={() => runAnalysis(task)}
                                        style={{ marginTop: '8px', width: '100%', background: '#16213e', border: '1px solid #0f3460', color: 'white', cursor: 'pointer', padding: '5px', borderRadius: '3px' }}
                                    >
                                        Run Deep Analysis
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analysis View */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', minHeight: '300px' }}>
                    <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>AI Decision Engine</h4>

                    {!analysis ? (
                        <div style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>Select a task to analyze</div>
                    ) : analysis.loading ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: 'cyan' }}>Running predictive models...</div>
                    ) : (
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>RISK LEVEL</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: analysis.riskLevel === 'CRITICAL' ? 'red' : analysis.riskLevel === 'LOW' ? '#0f0' : 'orange' }}>
                                    {analysis.riskLevel || 'N/A'} ({analysis.riskScore || analysis.fraudProbability}%)
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>SUGGESTED ACTION</div>
                                <div style={{ fontSize: '1.1rem', color: '#fff', padding: '5px', background: 'rgba(0,255,255,0.1)', border: '1px solid cyan', display: 'inline-block', borderRadius: '5px' }}>
                                    {analysis.suggestedAction || analysis.suggestedVerdict}
                                </div>
                            </div>

                            {analysis.reasoning && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>AI REASONING</div>
                                    <ul style={{ fontSize: '0.9rem', paddingLeft: '20px', color: '#ccc' }}>
                                        {analysis.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            )}

                            {analysis.summary && (
                                <p style={{ fontSize: '0.9rem', color: '#ccc', fontStyle: 'italic' }}>"{analysis.summary}"</p>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <button className="btn-neon" style={{ marginRight: '10px', borderColor: '#0f0', color: '#0f0' }}>Approve AI Suggestion</button>
                                <button className="btn-neon" style={{ borderColor: 'red', color: 'red' }}>Override & Reject</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiAdminCopilotPanel;
