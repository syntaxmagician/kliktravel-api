import { Module } from '@nestjs/common';
import { OpenTripsController } from './open-trips.controller';
import { OpenTripsService } from './open-trips.service';

@Module({
  controllers: [OpenTripsController],
  providers: [OpenTripsService],
  exports: [OpenTripsService],
})
export class OpenTripsModule {}
