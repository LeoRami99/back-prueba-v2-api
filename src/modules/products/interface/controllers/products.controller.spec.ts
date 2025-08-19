import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { ProductsEntity } from '../../domain/entities/products.entity';
import { GetProductsDto } from '../dtos/get-products.dto';
import { ValidationPipe } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getAllProductsUseCase: GetAllProductsUseCase;

  const mockProducts: ProductsEntity[] = [
    new ProductsEntity(
      '1',
      'Test Product 1',
      100,
      'COP',
      'Description 1',
      'image1.jpg',
      'Category 1',
      10,
    ),
    new ProductsEntity(
      '2',
      'Test Product 2',
      200,
      'COP',
      'Description 2',
      'image2.jpg',
      'Category 2',
      20,
    ),
  ];

  beforeEach(async () => {
    const getAllProductsUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: GetAllProductsUseCase,
          useValue: getAllProductsUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    getAllProductsUseCase = module.get<GetAllProductsUseCase>(
      GetAllProductsUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return products with default pagination when no query params provided', async () => {
      const expectedResult = {
        products: mockProducts,
        total: 2,
        pages: 1,
      };

      jest
        .spyOn(getAllProductsUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const query = new GetProductsDto();
      const result = await controller.finAll(query);

      expect(getAllProductsUseCase.execute).toHaveBeenCalledWith(
        1,
        5,
        undefined,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return products with custom pagination when query params provided', async () => {
      const expectedResult = {
        products: mockProducts,
        total: 2,
        pages: 1,
      };

      const query = new GetProductsDto();
      query.page = 2;
      query.pageSize = 10;
      query.filter = 'test';

      jest
        .spyOn(getAllProductsUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.finAll(query);

      expect(getAllProductsUseCase.execute).toHaveBeenCalledWith(2, 10, 'test');
      expect(result).toEqual(expectedResult);
    });
  });
});
