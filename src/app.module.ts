import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { JourneysModule } from './modules/journeys/journeys.module';
import { OpenTripsModule } from './modules/open-trips/open-trips.module';
import { JournalModule } from './modules/journal/journal.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { MediaModule } from './modules/media/media.module';
import { PrivateRequestsModule } from './modules/private-requests/private-requests.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DestinationsModule,
    JourneysModule,
    OpenTripsModule,
    JournalModule,
    TestimonialsModule,
    MediaModule,
    PrivateRequestsModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
