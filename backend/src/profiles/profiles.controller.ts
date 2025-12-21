import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfilesService } from './profiles.service';

import { AuthService } from '../auth/auth.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly authService: AuthService,
  ) { }

  @Get(':userId')
  async getProfile(@Param('userId') userId: string, @Query('role') role: string) {
    const profile: any = this.profilesService.getProfile(userId, role);
    const authUser = this.authService.getUserById(userId);

    if (profile && authUser) {
      profile.referralCode = authUser.referralCode;
      profile.referralCount = authUser.referralCount;
      profile.referralEarnings = authUser.referralEarnings;
      // Also maybe referralLink helper?
    }
    return profile;
  }

  @Post(':userId/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(
    @Param('userId') userId: string,
    @Body('role') role: string,
    @UploadedFile() file: any,
  ) {
    return this.profilesService.updateProfileImage(userId, role, file.path);
  }

  @Post(':userId/upload-document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadDocument(
    @Param('userId') userId: string,
    @Body('role') role: string,
    @UploadedFile() file: any,
  ) {
    return this.profilesService.addDocument(userId, role, file.path);
  }

  @Post(':userId/update')
  updateProfile(@Param('userId') userId: string, @Body() body: any) {
    // body includes role and other fields
    // Extract role from body, rest is updates
    const { role, ...updates } = body;
    return this.profilesService.updateProfile(userId, role, updates);
  }

  @Post(':workerId/endorse')
  endorseSkill(
    @Param('workerId') workerId: string,
    @Body() body: { skill: string; endorserId: string; endorserRole: string },
  ) {
    return this.profilesService.endorseSkill(
      workerId,
      body.skill,
      body.endorserId,
      body.endorserRole,
    );
  }

  @Post(':workerId/add-xp')
  addXP(@Param('workerId') workerId: string, @Body() body: { amount: number }) {
    return this.profilesService.addXP(workerId, body.amount);
  }
}
