import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('commission')
  getCommisionSettings() {
    return this.settingsService.getSettings();
  }

  @Post('commission')
  updateCommissionSettings(
    @Body() body: { platformFee: number; investorDividend: number },
  ) {
    return this.settingsService.updateSettings(
      body.platformFee,
      body.investorDividend,
    );
  }

  @Get('terms')
  getTerms() {
    return { text: this.settingsService.getSettings().termsAndConditions };
  }

  @Post('terms')
  updateTerms(@Body() body: { text: string }) {
    return this.settingsService.updateTerms(body.text);
  }
}
