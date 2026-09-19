import { Module } from '@nestjs/common';
import { createServiceConfigModule } from '@ecommerce/shared-config';
import { OrderServiceController } from './order-service.controller.js';
import { OrderServiceService } from './order-service.service.js';

@Module({
  imports: [createServiceConfigModule('order-service')],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
