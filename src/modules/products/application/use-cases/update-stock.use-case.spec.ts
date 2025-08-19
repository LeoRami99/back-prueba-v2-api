import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStockUseCase } from './update-stock.use-case';
import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UpdateStockUseCase', () => {
  let useCase: UpdateStockUseCase;
  let repository: ProductsRepository;

  const mockProduct = new ProductsEntity(
    '1',
    'Test Product',
    100,
    'COP',
    'Description',
    'image.jpg',
    'Category',
    10,
  );

  beforeEach(async () => {
    const productsRepositoryMock = {
      getAll: jest.fn(),
      updateStockByProductId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStockUseCase,
        {
          provide: ProductsRepository,
          useValue: productsRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update product stock successfully', async () => {
      const productId = '1';
      const stockToUpdate = 5;

      jest
        .spyOn(repository, 'updateStockByProductId')
        .mockResolvedValue(mockProduct);

      const result = await useCase.execute(productId, stockToUpdate);

      expect(repository.updateStockByProductId).toHaveBeenCalledWith(
        productId,
        stockToUpdate,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException when id or stock is not provided', async () => {
      await expect(useCase.execute('', 5)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute('1', undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      const productId = 'nonexistent-id';
      const stockToUpdate = 5;

      jest.spyOn(repository, 'updateStockByProductId').mockResolvedValue(null);

      await expect(useCase.execute(productId, stockToUpdate)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when repository throws an error', async () => {
      const productId = '1';
      const stockToUpdate = 5;

      jest
        .spyOn(repository, 'updateStockByProductId')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(productId, stockToUpdate)).rejects.toThrow();
    });
  });
});
