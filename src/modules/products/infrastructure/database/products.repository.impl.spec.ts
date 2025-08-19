import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepositoryImpl } from './products.repository.impl';
import { ProductModel } from './product.model';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';

describe('ProductsRepositoryImpl', () => {
  let repository: ProductsRepositoryImpl;
  let productModel: typeof ProductModel;
  let sequelize: Sequelize;

  const mockProductModel = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepositoryImpl,
        {
          provide: getModelToken(ProductModel),
          useValue: mockProductModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    repository = module.get<ProductsRepositoryImpl>(ProductsRepositoryImpl);
    productModel = module.get<typeof ProductModel>(getModelToken(ProductModel));
    sequelize = module.get<Sequelize>(Sequelize);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return products with pagination', async () => {
      const mockRows = [
        {
          id: '1',
          name: 'Test Product 1',
          price: 100,
          currency: 'COP',
          description: 'Description 1',
          image: 'image1.jpg',
          category: 'Category 1',
          stock: 10,
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: 200,
          currency: 'COP',
          description: 'Description 2',
          image: 'image2.jpg',
          category: 'Category 2',
          stock: 20,
        },
      ];

      const mockResult = {
        count: 2,
        rows: mockRows,
      };

      mockProductModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await repository.getAll(1, 5);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 5,
        offset: 0,
      });

      expect(result).toEqual({
        products: mockRows,
        total: 2,
        pages: 1,
      });
    });

    it('should apply filter when provided', async () => {
      const filter = 'test';
      const mockRows = [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          currency: 'COP',
          description: 'Description',
          image: 'image.jpg',
          category: 'Category',
          stock: 10,
        },
      ];

      const mockResult = {
        count: 1,
        rows: mockRows,
      };

      mockProductModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await repository.getAll(1, 5, filter);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith({
        where: { name: { [Op.like]: `%${filter}%` } },
        limit: 5,
        offset: 0,
      });

      expect(result).toEqual({
        products: mockRows,
        total: 1,
        pages: 1,
      });
    });
  });

  describe('updateStockByProductId', () => {
    it('should update product stock successfully', async () => {
      const productId = '1';
      const stockToUpdate = 5;

      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 100,
        currency: 'COP',
        description: 'Description',
        image: 'image.jpg',
        category: 'Category',
        stock: 10,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockResolvedValue(mockTransaction);
      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockProductModel.update.mockResolvedValue([1]);

      const result = await repository.updateStockByProductId(
        productId,
        stockToUpdate,
      );

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId, {
        raw: true,
      });
      expect(mockProductModel.update).toHaveBeenCalledWith(
        { stock: 5 }, // 10 - 5 = 5
        {
          where: { id: productId },
          returning: true,
          transaction: mockTransaction,
        },
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'nonexistent-id';
      const stockToUpdate = 5;

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockResolvedValue(mockTransaction);
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(
        repository.updateStockByProductId(productId, stockToUpdate),
      ).rejects.toThrow(NotFoundException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException when stock is negative', async () => {
      const productId = '1';
      const stockToUpdate = -5;

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockResolvedValue(mockTransaction);

      await expect(
        repository.updateStockByProductId(productId, stockToUpdate),
      ).rejects.toThrow(NotFoundException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException when resulting stock would be negative', async () => {
      const productId = '1';
      const stockToUpdate = 15; // More than available stock

      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 100,
        currency: 'COP',
        description: 'Description',
        image: 'image.jpg',
        category: 'Category',
        stock: 10, // Only 10 in stock
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelize.transaction.mockResolvedValue(mockTransaction);
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      await expect(
        repository.updateStockByProductId(productId, stockToUpdate),
      ).rejects.toThrow(NotFoundException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
