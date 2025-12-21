
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { MessageSquare, X } from 'lucide-react';

// Connect to backend usually
const socket = io('http://localhost:3000');

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to chat');
        });

        socket.on('newMessage', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('newMessage');
            socket.off('connect');
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        const msg = { sender: 'Me', message: input, roomId: 'general' };

        // Optimistic UI update
        // setMessages(prev => [...prev, msg]); 

        socket.emit('sendMessage', msg);
        setInput('');
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'var(--neon-purple)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px var(--neon-purple)'
                    }}
                >
                    <MessageSquare color="white" />
                </button>
            )}

            {isOpen && (
                <div className="glass-panel" style={{ width: '300px', height: '400px', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Live Chat</span>
                        <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>

                    <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ marginBottom: '8px', textAlign: msg.sender === 'Me' ? 'right' : 'left' }}>
                                <span style={{
                                    background: msg.sender === 'Me' ? 'var(--neon-cyan)' : '#333',
                                    padding: '5px 10px', borderRadius: '10px', fontSize: '0.9rem', color: '#fff',
                                    display: 'inline-block'
                                }}>
                                    {msg.message}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '10px', display: 'flex' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', marginRight: '5px', background: '#222', color: '#fff' }}
                        />
                        <button onClick={sendMessage} style={{ background: 'var(--neon-blue)', border: 'none', borderRadius: '5px', color: '#fff', padding: '0 10px', cursor: 'pointer' }}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
