import { Module } from '@nestjs/common';
import { createServiceConfigModule } from '@ecommerce/shared-config';
import { GatewayController } from './gateway.controller.js';
import { GatewayService } from './gateway.service.js';

@Module({
  imports: [createServiceConfigModule('gateway')],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
