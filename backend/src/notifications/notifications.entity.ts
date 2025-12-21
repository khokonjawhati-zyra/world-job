
export class Notification {
    id: string;
    title: string;
    content: string;
    type: string; // INFO, WARNING, ALERT, BANNER
    targetRole: string; // ALL, WORKER, EMPLOYER, INVESTOR
    targetUserId: string;
    isPersistent: boolean; // For banners
    priority: string; // LOW, MEDIUM, HIGH
    createdAt: Date;
    views: NotificationView[];
}

export class NotificationView {
    id: string;
    notificationId: string;
    userId: string;
    viewedAt: Date;
    notification: Notification;
}
