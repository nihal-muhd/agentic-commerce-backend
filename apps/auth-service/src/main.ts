import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const port = process.env.PORT ?? 4001;

  await app.listen(port);
}
await bootstrap();
