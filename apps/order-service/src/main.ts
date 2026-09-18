import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  const port = process.env.PORT ?? 4003;

  await app.listen(port);
}
await bootstrap();
