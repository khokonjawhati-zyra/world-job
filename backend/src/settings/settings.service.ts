import { Injectable } from '@nestjs/common';
import { SystemSettings } from './settings.model';

@Injectable()
export class SettingsService {
  private settings: SystemSettings = new SystemSettings();

  getSettings() {
    return this.settings;
  }

  updateSettings(platformFee: number, investorDividend: number) {
    this.settings.platformFeePercentage = platformFee;
    this.settings.investorDividendPercentage = investorDividend;
    return this.settings;
  }

  getPlatformFeeRate() {
    return this.settings.platformFeePercentage / 100;
  }

  getInvestorDividendRate() {
    return this.settings.investorDividendPercentage / 100;
  }

  updateTerms(text: string) {
    this.settings.termsAndConditions = text;
    return this.settings;
  }
}
