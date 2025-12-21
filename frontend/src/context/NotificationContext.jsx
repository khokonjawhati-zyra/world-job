
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId, role }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!userId) return;

        // Connect to Socket.IO
        const newSocket = io('https://world-job-backend.vercel.app', {
            query: { userId, role }
        });

        newSocket.on('connect', () => {
            console.log(`Connected to Notification Gateway as ${role} (${userId})`);
        });

        newSocket.on('notification', (payload) => {
            console.log('Received Notification:', payload);
            setNotifications(prev => [payload, ...prev]);

            // Optional: Browser Notification API
            if (Notification.permission === 'granted') {
                new Notification(payload.title, { body: payload.content });
            }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [userId, role]);

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`https://world-job-backend.vercel.app/notifications/my?userId=${userId}&role=${role}`);
            const data = await res.json();
            setNotifications(data);
        } catch (e) { console.error("Failed to fetch notifications", e); }
    };

    useEffect(() => {
        fetchNotifications();
        // Request browser permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [userId]);

    const markAsRead = async (id) => {
        try {
            await fetch(`https://world-job-backend.vercel.app/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (e) { console.error(e); }
    };

    return (
        <NotificationContext.Provider value={{ notifications, socket, fetchNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
