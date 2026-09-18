import { NestFactory } from '@nestjs/core';
import { CatalogServiceModule } from './catalog-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);
  const port = process.env.PORT ?? 4002;

  await app.listen(port);
}
await bootstrap();
