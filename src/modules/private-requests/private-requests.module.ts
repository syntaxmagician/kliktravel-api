import { Module } from '@nestjs/common';
import { PrivateRequestsController } from './private-requests.controller';
import { PrivateRequestsService } from './private-requests.service';

@Module({
  controllers: [PrivateRequestsController],
  providers: [PrivateRequestsService],
  exports: [PrivateRequestsService],
})
export class PrivateRequestsModule {}
