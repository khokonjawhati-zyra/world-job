import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const AdminCommunicationOverseer = () => {
    const [activeRooms, setActiveRooms] = useState([]);
    const [liveFeed, setLiveFeed] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        if (!socket) {
            socket = io('http://localhost:3001');
        }

        socket.emit('joinAdminOversight');

        socket.on('activeRooms', (rooms) => {
            setActiveRooms(rooms);
        });

        socket.on('adminMonitorMessage', (msg) => {
            setLiveFeed(prev => [msg, ...prev].slice(0, 50)); // Keep last 50

            // Update active rooms list if new activity
            setActiveRooms(prev => {
                const existing = prev.find(r => r.id === msg.roomId);
                if (existing) {
                    return prev.map(r => r.id === msg.roomId ? { ...r, lastMessage: msg } : r);
                } else {
                    return [{ id: msg.roomId, type: 'unknown', participantCount: 1, lastMessage: msg }, ...prev];
                }
            });
        });

        return () => {
            socket.off('activeRooms');
            socket.off('adminMonitorMessage');
        };
    }, []);

    return (
        <div className="glass-panel" style={{ padding: '30px', height: '80vh', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
            {/* Sidebar: Active Rooms */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
                <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>Active Hubs ({activeRooms.length})</h3>
                {activeRooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        style={{
                            padding: '15px',
                            background: selectedRoom?.id === room.id ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>{room.type?.toUpperCase() || 'CHAT'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: {room.id.substring(0, 8)}...</div>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {room.lastMessage?.content || 'No messages'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content: Monitor */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>
                    {selectedRoom ? `Monitoring: ${selectedRoom.id}` : 'Global Live Feed'}
                </h3>

                <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '20px', overflowY: 'auto' }}>
                    {(selectedRoom ? liveFeed.filter(m => m.roomId === selectedRoom.id) : liveFeed).map((msg, i) => (
                        <div key={i} style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                            <div style={{ minWidth: '80px', fontSize: '0.8rem', color: '#666' }}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        color: msg.senderRole === 'admin' ? 'var(--neon-cyan)' :
                                            msg.senderRole === 'worker' ? 'var(--neon-pink)' :
                                                msg.senderRole === 'employer' ? 'orange' : '#ffd700',
                                        fontWeight: 'bold', fontSize: '0.9rem'
                                    }}>
                                        {msg.senderName} ({msg.senderRole})
                                    </span>
                                    <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                                        {msg.roomId.substring(0, 6)}
                                    </span>
                                </div>
                                <div style={{ marginTop: '5px', color: '#ddd' }}>
                                    {msg.type === 'zoom_invite' ? (
                                        <span style={{ color: '#0E71EB' }}>📹 Started a Zoom Meeting: {msg.metadata?.topic}</span>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {liveFeed.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>Waiting for global communications...</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminCommunicationOverseer;
