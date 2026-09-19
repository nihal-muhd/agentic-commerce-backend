import { NestFactory } from '@nestjs/core';
import { setupHttpApp } from '@ecommerce/shared-config';
import { PaymentServiceModule } from './payment-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  const port = setupHttpApp(app, 'payment-service');

  await app.listen(port);
}
await bootstrap();
