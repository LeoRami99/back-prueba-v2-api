import { ProductModel } from './product.model';
import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsRepositoryImpl implements ProductsRepository {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    private readonly sequelize: Sequelize,
  ) {}
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

    const { count, rows } = await this.productModel.findAndCountAll({
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

  async updateStockByProductId(
    id: string,
    stock: number,
  ): Promise<ProductsEntity> {
    const tx = await this.sequelize.transaction();
    try {
      const product = await this.productModel.findByPk(id, {
        raw: true,
      });
      if (!product) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Product not found',
        });
      }

      if (stock < 0) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Stock cannot be negative',
        });
      }
      const stockUpdate = product.stock - stock;

      if (stockUpdate < 0) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Stock cannot be negative after update',
        });
      }

      const updateProduct = await this.productModel.update(
        { stock: stockUpdate },
        {
          where: { id },
          returning: true,
          transaction: tx,
        },
      );
      if (!updateProduct) {
        await tx.rollback();
        throw new NotFoundException({
          statusCode: 404,
          message: 'Error updating product stock',
        });
      }
      await tx.commit();
      return product as ProductsEntity;
    } catch (error: unknown) {
      await tx.rollback();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error updating product stock',
      });
    }
  }
}
