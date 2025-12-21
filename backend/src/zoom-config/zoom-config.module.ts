
import { Module } from '@nestjs/common';
import { ZoomConfigService } from './zoom-config.service';
import { ZoomConfigController } from './zoom-config.controller';
import { SecurityModule } from '../security/security.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [SecurityModule, NotificationsModule],
    controllers: [ZoomConfigController],
    providers: [ZoomConfigService],
    exports: [ZoomConfigService],
})
export class ZoomConfigModule { }
