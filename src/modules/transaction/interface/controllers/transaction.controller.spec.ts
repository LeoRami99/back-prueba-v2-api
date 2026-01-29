import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionByIdUseCase } from '../../application/use-cases/get-transaction-id.use-case';
import { GetTransactionByInternalIdUseCase } from '../../application/use-cases/get-transaction-internal-id.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let createTransactionUseCase: CreateTransactionUseCase;
  let getTransactionByIdUseCase: GetTransactionByIdUseCase;
  let getTransactionByInternalIdUseCase: GetTransactionByInternalIdUseCase;

  const mockTransaction: TransactionEntity = {
    id: '1',
    userId: 'user-1',
    productId: 'product-1',
    price: 100,
    status: 'PENDING',
    referenceInternalTransaction: 'ref-internal-1',
    idExternalTransaction: 'ext-tx-1',
    amount: 100,
    methodPayment: 'CARD',
  };

  beforeEach(async () => {
    const createTransactionUseCaseMock = {
      execute: jest.fn(),
    };

    const getTransactionByIdUseCaseMock = {
      execute: jest.fn(),
    };
    const getTransactionByInternalIdUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: CreateTransactionUseCase,
          useValue: createTransactionUseCaseMock,
        },
        {
          provide: GetTransactionByIdUseCase,
          useValue: getTransactionByIdUseCaseMock,
        },
        {
          provide: GetTransactionByInternalIdUseCase,
          useValue: getTransactionByInternalIdUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(
      CreateTransactionUseCase,
    );
    getTransactionByIdUseCase = module.get<GetTransactionByIdUseCase>(
      GetTransactionByIdUseCase,
    );
    getTransactionByInternalIdUseCase =
      module.get<GetTransactionByInternalIdUseCase>(
        GetTransactionByInternalIdUseCase,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      // Arrange
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        userId: 'user-1',
        methodPayment: 'CARD',
        productId: 'product-1',
        price: 100,
        token_card: 'card-token-123',
        acceptance_token: 'acceptance-token-123',
        installments: 1,
      };

      jest
        .spyOn(createTransactionUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await controller.create(createTransactionDto);

      // Assert
      expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
        {
          amount: createTransactionDto.amount,
          userId: createTransactionDto.userId,
          methodPayment: createTransactionDto.methodPayment,
          productId: createTransactionDto.productId,
          price: createTransactionDto.price,
        },
        createTransactionDto.token_card,
        createTransactionDto.acceptance_token,
        createTransactionDto.installments,
      );
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionById', () => {
    it('should get a transaction by ID', async () => {
      // Arrange
      const transactionId = '1';

      jest
        .spyOn(getTransactionByIdUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await controller.getTransactionById(transactionId);

      // Assert
      expect(getTransactionByIdUseCase.execute).toHaveBeenCalledWith(
        transactionId,
      );
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionByInternalId', () => {
    it('should get a transaction by internal ID', async () => {
      // Arrange
      const internalId = 'ref-internal-1';

      jest
        .spyOn(getTransactionByInternalIdUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await controller.getTransactionByInternalId(internalId);

      // Assert
      expect(getTransactionByInternalIdUseCase.execute).toHaveBeenCalledWith(
        internalId,
      );
      expect(result).toEqual(mockTransaction);
    });
  });
});
