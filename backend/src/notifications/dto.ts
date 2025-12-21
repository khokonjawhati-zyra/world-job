
export class CreateNotificationDto {
    title: string;
    content: string;
    type?: string;
    targetRole?: string;
    targetUserId?: string;
    isPersistent?: boolean;
    priority?: string;
}

export class MarkAsReadDto {
    userId: string;
}
