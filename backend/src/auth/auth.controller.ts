import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('2fa/enable')
  async enable2FA(@Body('userId') userId: string) {
    return this.authService.enable2FA(userId);
  }

  @Get('admin/users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('admin/users/:userId/update')
  updateUser(@Param('userId') userId: string, @Body() body: any) {
    return this.authService.updateUser(userId, body);
  }

  @Post('admin/users/:userId/ban')
    return this.authService.banUser(userId);
  }

@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.authService.forgotPassword(email);
}
}
