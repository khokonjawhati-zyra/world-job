import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Ip,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SecurityService } from './security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('status')
  getSystemStatus() {
    return {
      e2ee: 'Active',
      ledger: 'Immutable',
      mfa: 'Enforced',
      coldStorage: 'Active',
    };
  }

  @Post('mfa/setup')
  setupMFA(@Body() body: { userId: string }) {
    return this.securityService.generateMFASecret(body.userId);
  }

  @Post('mfa/verify')
  verifyMFA(@Body() body: { token: string; secret: string }) {
    const isValid = this.securityService.verifyMFA(body.token, body.secret);
    if (!isValid)
      throw new HttpException('Invalid OTP Code', HttpStatus.UNAUTHORIZED);
    return { success: true };
  }

  @Post('encrypt-test')
  testEncryption(@Body() body: { text: string }) {
    const encrypted = this.securityService.encrypt(body.text);
    const decrypted = this.securityService.decrypt(encrypted);
    return {
      original: body.text,
      encrypted,
      decrypted,
      match: body.text === decrypted,
    };
  }
}
