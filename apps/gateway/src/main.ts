import { NestFactory } from '@nestjs/core';
import { setupHttpApp } from '@ecommerce/shared-config';
import { GatewayModule } from './gateway.module.js';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const port = setupHttpApp(app, 'gateway');

  await app.listen(port);
}
await bootstrap();
