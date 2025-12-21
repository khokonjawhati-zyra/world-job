import { Module } from '@nestjs/common';
// Trigger rebuild
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchingModule } from './matching/matching.module';
import { ProjectsModule } from './projects/projects.module';
import { InvestorsModule } from './investors/investors.module';
import { FinancialModule } from './financial/financial.module';

import { ChatModule } from './chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DisputesModule } from './disputes/disputes.module';
import { ConfigModule } from '@nestjs/config';

import { PaymentModule } from './payment/payment.module';
import { TaxModule } from './tax/tax.module';
import { EmergencyModule } from './emergency/emergency.module';

import { SupportModule } from './support/support.module';
import { ProfilesModule } from './profiles/profiles.module';

import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { VerificationModule } from './verification/verification.module';
import { CategoriesModule } from './categories/categories.module';
import { WorkerRequestModule } from './worker-request/worker-request.module';
import { SettingsModule } from './settings/settings.module';
import { LaborModule } from './labor/labor.module';
import { CommunityModule } from './community/community.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MonetizationModule } from './monetization/monetization.module';
import { GlobalWorkPermitModule } from './work-permit/global-work-permit.module';
import { IdentityModule } from './identity/identity.module';
import { AiAdminModule } from './ai-admin/ai-admin.module';
import { AuthModule } from './auth/auth.module';
import { InvestmentModule } from './investment/investment.module';

import { MetadataController } from './metadata/metadata.controller';
import { SecurityModule } from './security/security.module';
import { LegalModule } from './legal/legal.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentConfigModule } from './payment-config/payment-config.module';
import { ZoomConfigModule } from './zoom-config/zoom-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MatchingModule,
    ProjectsModule,
    InvestorsModule,
    ChatModule,
    ReviewsModule,
    DisputesModule,
    PaymentModule,
    TaxModule,
    EmergencyModule,
    SupportModule,
    ProfilesModule,
    TimeTrackingModule,
    VerificationModule,
    CategoriesModule,
    WorkerRequestModule,
    FinancialModule,
    SettingsModule,
    LaborModule,
    CommunityModule,
    AnalyticsModule,
    MonetizationModule,
    GlobalWorkPermitModule,
    IdentityModule,
    AiAdminModule,
    AuthModule,
    InvestmentModule,
    SecurityModule,
    LegalModule,
    NotificationsModule,
    PaymentConfigModule,
    ZoomConfigModule,
  ],
  controllers: [AppController, MetadataController],
  providers: [AppService],
})
export class AppModule { }
