
import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBanner = () => {
    const { notifications } = useNotifications();
    // Find the most recent persistent notification or banner type
    const activeBanner = notifications
        .filter(n => (n.type === 'BANNER' || n.isPersistent) && !n.isRead) // Or maybe keep showing even if read if persistent? Usually banners are closable.
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!activeBanner) return null;

    const getBgColor = (type) => {
        if (type === 'ALERT') return 'linear-gradient(90deg, #ff0000, #990000)';
        if (type === 'WARNING') return 'linear-gradient(90deg, #ff9900, #ff5500)';
        return 'linear-gradient(90deg, #0066ff, #00ccff)';
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                    background: getBgColor(activeBanner.type),
                    color: 'white',
                    textAlign: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ padding: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    {activeBanner.type === 'ALERT' && <span>🚨</span>}
                    {activeBanner.type === 'WARNING' && <span>⚠️</span>}
                    {activeBanner.type === 'INFO' && <span>ℹ️</span>}
                    <span>{activeBanner.title}: {activeBanner.content}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
export default NotificationBanner;
