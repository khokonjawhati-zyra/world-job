import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) { }

  @Post('submit')
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
  submitRequest(
    @Body()
    body: {
      userId: string;
      userType: 'WORKER' | 'EMPLOYER' | 'INVESTOR';
      type: 'IDENTITY' | 'PHONE' | 'EMAIL';
      data: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const verificationData = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : body.data;

    return this.verificationService.submitRequest(
      body.userId,
      body.userType,
      body.type,
      verificationData,
    );
  }

  @Get('pending')
  getPending() {
    return this.verificationService.getPendingRequests();
  }

  @Get('user/:userId')
  getUserRequests(@Param('userId') userId: string) {
    return this.verificationService.getRequestsByUser(userId);
  }

  @Get('status/:userId')
  getVerificationStatus(@Param('userId') userId: string) {
    return {
      userId,
      isVerified: this.verificationService.isUserVerified(userId),
      requests: this.verificationService.getRequestsByUser(userId),
    };
  }

  @Post('approve/:id')
  approve(@Param('id') id: string) {
    return this.verificationService.approveRequest(id);
  }

  @Post('reject/:id')
  reject(@Param('id') id: string) {
    return this.verificationService.rejectRequest(id);
  }
}
