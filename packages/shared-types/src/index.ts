export type ServiceName =
  | 'gateway'
  | 'auth-service'
  | 'catalog-service'
  | 'order-service'
  | 'payment-service'
  | 'agent-service';

export type NodeEnvironment = 'development' | 'test' | 'production';

export type UserRole = 'USER' | 'ADMIN';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type StandardErrorResponse = {
  success: false;
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
  service: ServiceName;
};

export type ServiceHealth = {
  service: ServiceName;
  status: 'ok';
};
