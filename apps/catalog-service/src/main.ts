import { NestFactory } from '@nestjs/core';
import { setupHttpApp } from '@ecommerce/shared-config';
import { CatalogServiceModule } from './catalog-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);
  const port = setupHttpApp(app, 'catalog-service');

  await app.listen(port);
}
await bootstrap();
