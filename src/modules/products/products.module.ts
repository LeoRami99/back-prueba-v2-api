import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';

import { ProductModel } from './infrastructure/database/product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { ProductsRepository } from './domain/repositories/products.repository';
import { ProductsRepositoryImpl } from './infrastructure/database/products.repository';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductsController],
  providers: [
    GetAllProductsUseCase,
    {
      provide: ProductsRepository,
      useClass: ProductsRepositoryImpl,
    },
  ],
})
export class ProductsModule {}
