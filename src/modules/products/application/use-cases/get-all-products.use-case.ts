import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../domain/repositories/products.repository';

import { ProductsEntity } from '../../domain/entities/products.entity';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}
  async execute(
    page: number = 1,
    pageSize: number = 5,
    filter: string | undefined,
  ): Promise<{
    products: ProductsEntity[];
    total: number;
    pages: number;
  }> {
    return this.productsRepository.getAll(page, pageSize, filter);
  }
}
