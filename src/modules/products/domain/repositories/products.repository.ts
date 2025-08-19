import { ProductsEntity } from '../entities/products.entity';

export abstract class ProductsRepository {
  abstract getAll(
    page: number,
    pageSize: number,
    filter?: string,
  ): Promise<{
    products: ProductsEntity[];
    total: number;
    pages: number;
  }>;
  abstract updateStockByProductId(
    id: string,
    stock: number,
  ): Promise<ProductsEntity>;
}
