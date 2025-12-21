
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SecurityService } from '../security/security.service';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ZoomConfigService {
    private readonly logger = new Logger(ZoomConfigService.name);
    private readonly DATA_FILE = path.join(process.cwd(), 'data', 'zoom_config_encrypted.json');

    constructor(
        private securityService: SecurityService,
        private notificationsService: NotificationsService
    ) { }

    async saveConfig(config: any) {
        // Encrypt sensitive fields
        const encryptedConfig = {
            accountId: this.securityService.encrypt(config.accountId || ''),
            clientId: this.securityService.encrypt(config.clientId || ''),
            clientSecret: this.securityService.encrypt(config.clientSecret || ''),
            updatedAt: new Date(),
        };

        try {
            fs.writeFileSync(this.DATA_FILE, JSON.stringify(encryptedConfig, null, 2));
            this.logger.log('Zoom Configuration Saved & Encrypted');
            return { success: true };
        } catch (error) {
            this.logger.error('Failed to save zoom config', error);
            throw error;
        }
    }

    async getConfig(showSecrets = false) {
        if (!fs.existsSync(this.DATA_FILE)) {
            return { accountId: '', clientId: '', clientSecret: '' };
        }

        try {
            const data = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));

            if (showSecrets) {
                return {
                    accountId: this.decryptSafe(data.accountId),
                    clientId: this.decryptSafe(data.clientId),
                    clientSecret: this.decryptSafe(data.clientSecret)
                };
            }

            return {
                accountId: this.mask(this.decryptSafe(data.accountId)),
                clientId: this.mask(this.decryptSafe(data.clientId)),
                clientSecret: '••••••••',
            };
        } catch (error) {
            this.logger.error('Failed to read zoom config', error);
            return {};
        }
    }

    private decryptSafe(encrypted: string): string {
        if (!encrypted) return '';
        try {
            return this.securityService.decrypt(encrypted);
        } catch (e) {
            return '';
        }
    }

    private mask(text: string): string {
        if (!text || text.length < 6) return '****';
        return text.substring(0, 3) + '****' + text.substring(text.length - 3);
    }

    // --- ZOOM API LOGIC ---

    async getAccessToken(): Promise<string> {
        const config = await this.getConfig(true);
        if (!config.accountId || !config.clientId || !config.clientSecret) {
            throw new BadRequestException('Zoom credentials not configured');
        }

        const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

        try {
            const params = new URLSearchParams({
                grant_type: 'account_credentials',
                account_id: config.accountId
            });

            const response = await fetch(`https://zoom.us/oauth/token?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            if (!response.ok) {
                const err = await response.text();
                this.logger.error(`Zoom Token Error: ${err}`);
                throw new BadRequestException('Failed to get Zoom access token');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            this.logger.error('Zoom Token Exception', error);
            throw new BadRequestException('Zoom authentication failed');
        }
    }

    async createMeeting(topic: string, startTime: string, participants: string[] = []) {
        const token = await this.getAccessToken();

        try {
            const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: topic,
                    type: 2, // Scheduled meeting
                    start_time: startTime,
                    duration: 60, // Default 1 hour
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: false,
                        mute_upon_entry: true
                    }
                })
            });

            if (!response.ok) {
                const err = await response.text();
                this.logger.error(`Zoom Create Meeting Error: ${err}`);
                throw new BadRequestException(`Failed to create meeting: ${err}`);
            }

            const meeting = await response.json();

            // Notify Participants
            if (participants && participants.length > 0) {
                for (const userId of participants) {
                    await this.notificationsService.create({
                        targetUserId: userId,
                        title: '📅 Zoom Meeting Invitation',
                        content: `You have been invited to a Zoom meeting: ${topic}.\n\nJoin URL: ${meeting.join_url}\nPassword: ${meeting.password}`,
                        type: 'INFO',
                        priority: 'HIGH'
                    });
                }
            }

            return {
                joinUrl: meeting.join_url,
                startUrl: meeting.start_url,
                password: meeting.password,
                id: meeting.id
            };
        } catch (error) {
            this.logger.error('Zoom Create Meeting Exception', error);
            throw error;
        }
    }
}
