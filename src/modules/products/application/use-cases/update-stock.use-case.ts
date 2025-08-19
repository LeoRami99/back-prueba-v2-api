import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UpdateStockUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string, stock: number): Promise<ProductsEntity> {
    if (!id || stock === undefined) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Product ID and stock are required',
      });
    }

    const product = await this.productsRepository.updateStockByProductId(
      id,
      stock,
    );
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found or stock update failed',
      });
    }

    return product;
  }
}
