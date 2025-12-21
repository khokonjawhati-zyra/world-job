
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) { }

    @Post('broadcast')
    async create(@Body() dto: CreateNotificationDto) {
        return this.service.create(dto);
    }

    @Get('my')
    async getMyNotifications(@Query('userId') userId: string, @Query('role') role: string) {
        if (!userId || !role) return [];
        return this.service.findAllForUser(userId, role);
    }

    @Put(':id/read')
    async markAsRead(@Param('id') id: string, @Body('userId') userId: string) {
        return this.service.markAsRead(id, userId);
    }

    @Get('stats')
    async getStats() {
        return this.service.getStats();
    }
}
