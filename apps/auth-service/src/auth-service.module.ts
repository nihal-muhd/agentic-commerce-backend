import { Module } from '@nestjs/common';
import { createServiceConfigModule } from '@ecommerce/shared-config';
import { AuthServiceController } from './auth-service.controller.js';
import { AuthServiceService } from './auth-service.service.js';

@Module({
  imports: [createServiceConfigModule('auth-service')],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
