import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  const port = process.env.PORT ?? 4004;

  await app.listen(port);
}
await bootstrap();
