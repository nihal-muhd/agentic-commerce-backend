import { Module } from '@nestjs/common';
import { createServiceConfigModule } from '@ecommerce/shared-config';
import { PaymentServiceController } from './payment-service.controller.js';
import { PaymentServiceService } from './payment-service.service.js';

@Module({
  imports: [createServiceConfigModule('payment-service')],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
