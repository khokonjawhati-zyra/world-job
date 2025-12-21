
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNotificationDto } from './dto';
import { Notification, NotificationView } from './notifications.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    private notifications: Notification[] = [];
    private views: NotificationView[] = [];

    constructor(private gateway: NotificationsGateway) { }

    async create(dto: CreateNotificationDto) {
        const notification: Notification = {
            id: uuidv4(),
            createdAt: new Date(),
            isPersistent: dto.isPersistent || false,
            priority: dto.priority || 'MEDIUM',
            title: dto.title,
            content: dto.content,
            type: dto.type || 'INFO',
            targetRole: dto.targetRole || 'ALL',
            targetUserId: dto.targetUserId || '',
            views: []
        };

        console.log('Created Notification Broadcast:', notification.title);
        this.notifications.push(notification);

        // Trigger WebSocket Broadcast
        // If targetUserId is set, send only to them.
        if (notification.targetUserId && notification.targetUserId !== '') {
            this.gateway.sendToUser(notification.targetUserId, notification);
        }
        // Otherwise broadcast to role
        else {
            this.gateway.broadcastToRole(notification.targetRole, notification);
        }

        return notification;
    }

    async findAllForUser(userId: string, role: string) {
        // Basic filter
        const userNotes = this.notifications.filter(n => {
            const matchesUser = n.targetUserId === userId;
            const matchesRole = n.targetRole === role || n.targetRole === 'ALL';
            return matchesUser || (matchesRole && !n.targetUserId);
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const result = userNotes.map(n => {
            const isRead = this.views.some(v => v.notificationId === n.id && v.userId === userId);
            return { ...n, isRead };
        });

        return result;
    }

    async markAsRead(notificationId: string, userId: string) {
        const exists = this.views.find(v => v.notificationId === notificationId && v.userId === userId);
        if (!exists) {
            this.views.push({
                id: uuidv4(),
                notificationId,
                userId,
                viewedAt: new Date(),
                notification: {} as Notification
            });
        }
        return { success: true };
    }

    async getStats() {
        return {
            totalNotifications: this.notifications.length,
            totalViews: this.views.length
        };
    }
}
