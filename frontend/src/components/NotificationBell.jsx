
import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const { notifications, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleRead = (id, event) => {
        event.stopPropagation();
        markAsRead(id);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={toggleOpen} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', position: 'relative', padding: '5px' }}>
                🔔
                {unreadCount > 0 && <span style={{
                    position: 'absolute', top: '0', right: '0', background: 'red', color: 'white',
                    fontSize: '0.7rem', width: '16px', height: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="glass-panel" style={{
                    position: 'absolute', top: '50px', right: '0', width: '350px', maxHeight: '400px', overflowY: 'auto',
                    padding: '0', borderRadius: '10px', border: '1px solid #444', zIndex: 1000, background: 'rgba(20, 20, 20, 0.95)',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid #333', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Notifications</span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{unreadCount} Unread</span>
                    </div>
                    <div>
                        {notifications.length === 0 ?
                            <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>No notifications</p> :
                            notifications.map(n => (
                                <div key={n.id} onClick={(e) => handleRead(n.id, e)} style={{
                                    padding: '12px 15px',
                                    borderBottom: '1px solid #333',
                                    background: n.isRead ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    textAlign: 'left'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(255, 255, 255, 0.05)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontWeight: 'bold', color: n.isRead ? '#aaa' : '#fff', fontSize: '0.9rem' }}>
                                            {n.type === 'ALERT' ? '🚨 ' : n.type === 'WARNING' ? '⚠️ ' : ''}{n.title}
                                        </span>
                                        {!n.isRead && <span style={{ width: '8px', height: '8px', background: 'var(--neon-cyan)', borderRadius: '50%' }}></span>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#bbb', marginBottom: '5px', lineHeight: '1.4' }}>{n.content}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};
export default NotificationBell;
