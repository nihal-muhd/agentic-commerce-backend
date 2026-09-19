import { NestFactory } from '@nestjs/core';
import { setupHttpApp } from '@ecommerce/shared-config';
import { OrderServiceModule } from './order-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  const port = setupHttpApp(app, 'order-service');

  await app.listen(port);
}
await bootstrap();
