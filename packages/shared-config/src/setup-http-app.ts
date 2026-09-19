import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ServiceName } from '@ecommerce/shared-types';

import { StandardHttpExceptionFilter } from './standard-http-exception.filter.js';

export function setupHttpApp(
  app: INestApplication,
  serviceName: ServiceName,
): number {
  app.useGlobalFilters(new StandardHttpExceptionFilter(serviceName));

  const config = app.get(ConfigService);
  return config.getOrThrow<number>('PORT');
}
