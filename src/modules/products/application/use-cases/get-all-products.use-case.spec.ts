import { Test, TestingModule } from '@nestjs/testing';
import { GetAllProductsUseCase } from './get-all-products.use-case';
import { ProductsRepository } from '../../domain/repositories/products.repository';
import { ProductsEntity } from '../../domain/entities/products.entity';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let repository: ProductsRepository;

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
    const productsRepositoryMock = {
      getAll: jest.fn(),
      updateStockByProductId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllProductsUseCase,
        {
          provide: ProductsRepository,
          useValue: productsRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should get all products with default pagination', async () => {
      const expectedResult = {
        products: mockProducts,
        total: 2,
        pages: 1,
      };

      jest.spyOn(repository, 'getAll').mockResolvedValue(expectedResult);

      const result = await useCase.execute();

      expect(repository.getAll).toHaveBeenCalledWith(1, 5, undefined);
      expect(result).toEqual(expectedResult);
    });

    it('should get all products with custom pagination', async () => {
      const page = 2;
      const pageSize = 10;
      const filter = 'test';

      const expectedResult = {
        products: mockProducts,
        total: 2,
        pages: 1,
      };

      jest.spyOn(repository, 'getAll').mockResolvedValue(expectedResult);

      const result = await useCase.execute(page, pageSize, filter);

      expect(repository.getAll).toHaveBeenCalledWith(page, pageSize, filter);
      expect(result).toEqual(expectedResult);
    });
  });
});
