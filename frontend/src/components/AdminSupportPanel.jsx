import React, { useState, useEffect } from 'react';

const AdminSupportPanel = () => {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState('all'); // all, open, resolved
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        setLoading(true);
        fetch('https://world-job-backend.vercel.app/support')
            .then(res => res.json())
            .then(data => {
                setTickets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch tickets:", err);
                setLoading(false);
            });
    };

    const resolveTicket = (id) => {
        if (!window.confirm("Mark this ticket as resolved?")) return;

        fetch(`https://world-job-backend.vercel.app/support/${id}/resolve`, { method: 'PATCH' })
            .then(res => res.json())
            .then(() => {
                alert("Ticket Resolved!");
                fetchTickets();
            })
            .catch(err => alert("Error: " + err.message));
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'open') return t.status !== 'resolved';
        if (filter === 'resolved') return t.status === 'resolved';
        return true;
    });

    const getPriorityColor = (p) => {
        if (p === 'high') return 'red';
        if (p === 'medium') return 'orange';
        return 'green';
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>Support Help Desk</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '15px', border: '1px solid #444', background: '#222', color: '#fff' }}
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open / Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <button onClick={fetchTickets} className="btn-neon">Refresh</button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading Tickets...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredTickets.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No tickets found.</div>
                    ) : filteredTickets.map(ticket => (
                        <div key={ticket.id} style={{
                            padding: '20px',
                            background: ticket.status === 'resolved' ? 'rgba(0,255,0,0.02)' : 'rgba(255,50,50,0.05)',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                                        padding: '2px 8px', borderRadius: '4px',
                                        background: getPriorityColor(ticket.priority), color: '#fff'
                                    }}>
                                        {ticket.priority}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>#{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>by {ticket.userType} ({ticket.userId})</span>
                                </div>
                                <h3 style={{ margin: '5px 0', color: '#fff' }}>{ticket.subject}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ticket.description}</p>
                            </div>

                            <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold', color: ticket.status === 'resolved' ? 'var(--neon-lime)' : 'orange' }}>
                                    {ticket.status.toUpperCase()}
                                </div>
                                {ticket.status !== 'resolved' && (
                                    <button
                                        onClick={() => resolveTicket(ticket.id)}
                                        className="btn-neon"
                                        style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--neon-lime)', color: 'var(--neon-lime)' }}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminSupportPanel;
