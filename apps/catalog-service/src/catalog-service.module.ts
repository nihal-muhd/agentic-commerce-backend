import { Module } from '@nestjs/common';
import { createServiceConfigModule } from '@ecommerce/shared-config';
import { CatalogServiceController } from './catalog-service.controller.js';
import { CatalogServiceService } from './catalog-service.service.js';

@Module({
  imports: [createServiceConfigModule('catalog-service')],
  controllers: [CatalogServiceController],
  providers: [CatalogServiceService],
})
export class CatalogServiceModule {}
