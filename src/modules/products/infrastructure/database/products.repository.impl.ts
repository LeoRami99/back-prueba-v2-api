import { ProductModel } from './product.model';
import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, ValidationError } from 'sequelize';
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
      if (!Number.isFinite(stock)) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Stock must be a valid number',
        });
      }

      const product = await this.productModel.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });
      if (!product) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Product not found',
        });
      }
      const parseProductJson = product.toJSON() as ProductsEntity;

      if (!Number.isFinite(parseProductJson.stock)) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Product stock is not initialized',
        });
      }

      if (stock < 0) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Stock cannot be negative',
        });
      }
      const stockUpdate = (parseProductJson?.stock ?? 0) - stock;

      if (stockUpdate < 0) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Stock cannot be negative after update',
        });
      }

      const updatedProduct = await product.update(
        { stock: stockUpdate },
        { transaction: tx },
      );

      await tx.commit();
      return updatedProduct as ProductsEntity;
    } catch (error: unknown) {
      await tx.rollback();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Invalid product stock update',
        });
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error updating product stock',
      });
    }
  }
}
