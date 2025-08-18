import { ProductModel } from './product.model';
import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';
import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

@Injectable()
export class ProductsRepositoryImpl implements ProductsRepository {
  async getAll(
    page: number,
    pageSize: number,
    filter?: string,
  ): Promise<{
    products: ProductsEntity[];
    total: number;
    pages: number;
  }> {
    const offset = (page - 1) * pageSize;
    const where = filter ? { name: { [Op.like]: `%${filter}%` } } : {};

    const { count, rows } = await ProductModel.findAndCountAll({
      where,
      limit: pageSize,
      offset,
    });

    return {
      products: rows as ProductsEntity[],
      total: count,
      pages: Math.ceil(count / pageSize),
    };
  }
}
