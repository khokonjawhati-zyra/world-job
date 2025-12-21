import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// Global socket instance to prevent multiple connections
let socket;

const UniversalChat = ({ roomId, userId, userName, userRole, isEmbedded = false, title = "Live Chat" }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(isEmbedded); // Default open if embedded
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([]); // Clear previous messages
        if (!roomId || !userId) return;

        // Auto-open chat if switching rooms (except initial load) or if in embedded mode
        if (!isEmbedded && roomId) {
            setIsOpen(true);
        }

        // Initialize Socket
        if (!socket) {
            socket = io('http://localhost:3000');
        }

        // Join Room
        socket.emit('joinRoom', { roomId, userId, role: userRole });

        // Listeners
        socket.on('roomHistory', (history) => {
            setMessages(history);
            scrollToBottom();
        });

        socket.on('newMessage', (msg) => {
            if (msg.roomId === roomId) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();
            }
        });

        // Cleanup listeners on unmount (but keep socket for persistence if needed, or disconnect)
        return () => {
            socket.off('roomHistory');
            socket.off('newMessage');
        };
    }, [roomId, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (!input.trim()) return;
        socket.emit('sendMessage', {
            roomId,
            senderId: userId,
            senderName: userName,
            role: userRole,
            content: input,
            type: 'text'
        });
        setInput('');
    };

    const handleScheduleMeeting = (topic) => {
        socket.emit('scheduleMeeting', {
            roomId,
            senderId: userId,
            topic: topic || "Quick Sync"
        });
        setIsMeetingModalOpen(false);
    };

    // UI Components
    const MessageBubble = ({ msg }) => {
        const isMe = msg.senderId === userId;
        return (
            <div style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
            }}>
                <div style={{
                    maxWidth: '80%',
                    background: msg.type === 'zoom_invite'
                        ? 'linear-gradient(135deg, #0E71EB, #0E71EB)'
                        : isMe ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)',
                    color: isMe ? '#000' : '#fff',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    borderTopRightRadius: isMe ? '2px' : '15px',
                    borderTopLeftRadius: isMe ? '15px' : '2px',
                    boxShadow: msg.type === 'zoom_invite' ? '0 5px 15px rgba(14, 113, 235, 0.4)' : 'none'
                }}>
                    {msg.senderRole !== 'system' && !isMe && (
                        <div style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '2px' }}>
                            {msg.senderName} ({msg.senderRole})
                        </div>
                    )}

                    {msg.type === 'text' && <div>{msg.content}</div>}

                    {msg.type === 'zoom_invite' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                <span style={{ fontSize: '1.5rem' }}>📹</span>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>Zoom Meeting Invite</div>
                                    <div style={{ fontSize: '0.8rem', color: '#eee' }}>{msg.metadata.topic}</div>
                                </div>
                            </div>
                            <a href={msg.metadata.meetingUrl} target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: 'block', textAlign: 'center', background: '#fff', color: '#0E71EB',
                                    padding: '5px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem'
                                }}>
                                Join Meeting
                            </a>
                        </div>
                    )}

                    <div style={{ fontSize: '0.6rem', textAlign: 'right', marginTop: '5px', opacity: 0.7 }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Logic
    if (isEmbedded) {
        return (
            <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', pading: '0' }}>
                <ChatHeader title={title} setIsMeetingModalOpen={setIsMeetingModalOpen} />
                <ChatMessages messages={messages} messagesEndRef={messagesEndRef} MessageBubble={MessageBubble} />
                <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
                {isMeetingModalOpen && <MeetingModal onClose={() => setIsMeetingModalOpen(false)} onSchedule={handleScheduleMeeting} />}
            </div>
        );
    }

    // Floating Widget Mode
    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: '90px', right: '30px', width: '350px', height: '500px',
                            background: '#09090b', border: '1px solid var(--neon-cyan)', borderRadius: '20px',
                            zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }}
                    >
                        <ChatHeader title={title} setIsMeetingModalOpen={setIsMeetingModalOpen} onClose={() => setIsOpen(false)} />
                        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} MessageBubble={MessageBubble} />
                        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
                        {isMeetingModalOpen && <MeetingModal onClose={() => setIsMeetingModalOpen(false)} onSchedule={handleScheduleMeeting} />}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '30px', right: '30px', width: '50px', height: '50px',
                    borderRadius: '50%', background: 'var(--neon-cyan)', border: 'none',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem',
                    cursor: 'pointer', zIndex: 1000, boxShadow: '0 0 20px var(--neon-cyan)'
                }}
            >
                💬
            </button>
        </>
    );
};

// Sub-components for cleaner code
const ChatHeader = ({ title, setIsMeetingModalOpen, onClose }) => (
    <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--neon-cyan)' }}>{title}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsMeetingModalOpen(true)} title="Start Zoom Meeting" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>📹</button>
            {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>✖</button>}
        </div>
    </div>
);

const ChatMessages = ({ messages, messagesEndRef, MessageBubble }) => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        <div ref={messagesEndRef} />
    </div>
);

const ChatInput = ({ input, setInput, handleSend }) => (
    <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
                flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '20px',
                padding: '10px 15px', color: '#fff', outline: 'none'
            }}
        />
        <button onClick={handleSend} style={{ background: 'var(--neon-cyan)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>➤</button>
    </div>
);

const MeetingModal = ({ onClose, onSchedule }) => {
    const [topic, setTopic] = useState('');
    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
            <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', width: '80%' }}>
                <h4 style={{ margin: '0 0 10px', color: '#fff' }}>Schedule Zoom Meeting</h4>
                <input
                    type="text" placeholder="Meeting Topic" value={topic} onChange={e => setTopic(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #555', background: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => onSchedule(topic)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#0E71EB', color: '#fff', cursor: 'pointer' }}>Schedule</button>
                </div>
            </div>
        </div>
    );
};

export default UniversalChat;
