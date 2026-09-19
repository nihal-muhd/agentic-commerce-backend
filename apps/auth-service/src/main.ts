import { NestFactory } from '@nestjs/core';
import { setupHttpApp } from '@ecommerce/shared-config';
import { AuthServiceModule } from './auth-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const port = setupHttpApp(app, 'auth-service');

  await app.listen(port);
}
await bootstrap();
