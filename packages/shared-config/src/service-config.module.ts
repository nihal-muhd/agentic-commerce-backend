import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

import type { ServiceName } from '@ecommerce/shared-types';

export const servicePortDefaults = {
  gateway: 4000,
  'auth-service': 4001,
  'catalog-service': 4002,
  'order-service': 4003,
  'payment-service': 4004,
  'agent-service': 8000,
} as const satisfies Record<ServiceName, number>;

export function getDefaultServicePort(serviceName: ServiceName): number {
  return servicePortDefaults[serviceName];
}

function createServiceEnvSchema(serviceName: ServiceName) {
  return z.object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce
      .number()
      .int()
      .min(1)
      .max(65535)
      .default(getDefaultServicePort(serviceName)),
    SERVICE_NAME: z.literal(serviceName).default(serviceName),
  });
}

export function createServiceConfigModule(serviceName: ServiceName) {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.local', '.env'],
    validationSchema: createServiceEnvSchema(serviceName),
  });
}
