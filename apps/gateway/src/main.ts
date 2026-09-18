import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module.js';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const port = process.env.PORT ?? 4000;

  await app.listen(port);
}
await bootstrap();
