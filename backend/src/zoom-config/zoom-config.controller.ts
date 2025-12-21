
import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ZoomConfigService } from './zoom-config.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('zoom')
export class ZoomConfigController {
    constructor(private readonly zoomService: ZoomConfigService) { }

    @Get('config')
    async getConfig() {
        // Return masked config
        return this.zoomService.getConfig(false);
    }

    @Post('config')
    async saveConfig(@Body() config: any) {
        // In real app, add Admin Guard
        return this.zoomService.saveConfig(config);
    }

    @Post('create-meeting')
    async createMeeting(@Body() body: { topic: string, startTime: string, participants?: string[] }) {
        // Role check removed for demo simplicity as AuthGuard was temporarily removed
        return this.zoomService.createMeeting(body.topic, body.startTime, body.participants);
    }
}
