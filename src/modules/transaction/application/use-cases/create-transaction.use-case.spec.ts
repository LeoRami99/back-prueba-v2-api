import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateExternalTransactionUseCase } from './create-external-transaction.use-case';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('/utils/hash256', () => ({
  hash256Signature: jest.fn().mockResolvedValue('mock-signature'),
}));

jest.mock('/utils/generateIdInternalTransaction', () => ({
  generateIdInternalTransaction: jest
    .fn()
    .mockReturnValue('mock-internal-reference'),
}));

jest.mock('/utils/convertToCents', () => ({
  convertToCents: jest.fn().mockReturnValue(12000),
}));

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let createExternalTransactionUseCase: jest.Mocked<CreateExternalTransactionUseCase>;

  const mockTransaction: TransactionEntity = {
    id: '1',
    userId: 'user-1',
    productId: 'product-1',
    price: 100,
    status: 'PENDING',
    referenceInternalTransaction: 'ref-internal-1',
    idExternalTransaction: 'ext-tx-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockExternalTransactionResponse = {
    data: {
      id: 'ext-tx-1',
      created_at: '2025-08-19T10:00:00.000Z',
      amount_in_cents: 12000,
      reference: 'mock-internal-reference',
      currency: 'COP',
      payment_method_type: 'CARD',
      payment_method: {
        type: 'CARD',
        installments: 1,
        token: 'token-123',
      },
      redirect_url: 'https://example.com/redirect',
      status: 'PENDING',
      status_message: null,
      merchant: {
        name: 'Test Merchant',
        legal_name: 'Test Merchant Inc',
        contact_name: 'John Doe',
        phone_number: '+1234567890',
        logo_url: null,
        legal_id_type: 'NIT',
        email: 'merchant@example.com',
        legal_id: '9008001234',
      },
    },
  };

  beforeEach(async () => {
    const transactionRepositoryMock = {
      create: jest.fn(),
      findByReferenceInternal: jest.fn(),
      findById: jest.fn(),
      findByExternalId: jest.fn(),
      updateByExternalId: jest.fn(),
    };

    const createExternalTransactionUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TransactionRepository,
          useValue: transactionRepositoryMock,
        },
        {
          provide: CreateExternalTransactionUseCase,
          useValue: createExternalTransactionUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    transactionRepository = module.get(
      TransactionRepository,
    ) as jest.Mocked<TransactionRepository>;
    createExternalTransactionUseCase = module.get(
      CreateExternalTransactionUseCase,
    ) as jest.Mocked<CreateExternalTransactionUseCase>;

    // Mock environment variables
    process.env.INTEGRITY_KEY = 'test-integrity-key';
    process.env.REDIRECT_FRONT_TX = 'https://example.com/redirect';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a transaction successfully', async () => {
      // Arrange
      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
      };

      const token_card = 'card-token-123';
      const acceptance_token = 'acceptance-token-123';
      const installments = 1;

      createExternalTransactionUseCase.execute.mockResolvedValue(
        mockExternalTransactionResponse,
      );
      transactionRepository.create.mockResolvedValue(mockTransaction);

      // Act
      const result = await useCase.execute(
        transactionData,
        token_card,
        acceptance_token,
        installments,
      );

      // Assert
      expect(createExternalTransactionUseCase.execute).toHaveBeenCalledWith({
        acceptance_token: acceptance_token,
        amount_in_cents: 12000,
        currency: 'COP',
        signature: 'mock-signature',
        reference: 'mock-internal-reference',
        customer_email: 'pruebasensandbox@yopmail.com',
        redirect_url: 'https://example.com/redirect',
        payment_method: {
          type: 'CARD',
          installments: installments,
          token: token_card,
        },
      });

      expect(transactionRepository.create).toHaveBeenCalledWith({
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
        referenceInternalTransaction: 'mock-internal-reference',
        idExternalTransaction: 'ext-tx-1',
      });

      expect(result).toEqual(mockTransaction);
    });

    it('should throw BadRequestException when transaction data is not provided', async () => {
      await expect(useCase.execute(null)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when price is not provided', async () => {
      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
      };

      await expect(useCase.execute(transactionData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when integrity key is not found', async () => {
      // Remove integrity key
      process.env.INTEGRITY_KEY = '';

      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
      };

      await expect(useCase.execute(transactionData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when redirect URL is not found', async () => {
      // Keep integrity key but remove redirect URL
      process.env.REDIRECT_FRONT_TX = '';

      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
      };

      await expect(useCase.execute(transactionData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when external transaction creation fails', async () => {
      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
      };

      createExternalTransactionUseCase.execute.mockResolvedValue(null);

      await expect(useCase.execute(transactionData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when internal transaction creation fails', async () => {
      const transactionData: Partial<TransactionEntity> = {
        userId: 'user-1',
        productId: 'product-1',
        price: 100,
      };

      createExternalTransactionUseCase.execute.mockResolvedValue(
        mockExternalTransactionResponse,
      );
      transactionRepository.create.mockResolvedValue(null);

      await expect(useCase.execute(transactionData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
