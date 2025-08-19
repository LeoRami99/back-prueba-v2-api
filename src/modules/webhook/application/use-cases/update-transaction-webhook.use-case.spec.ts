import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionWebhookUseCase } from './update-transaction-webhook.use-case';
import { UpdateTransactionByIdExternalUseCase } from '../../../transaction/application/use-cases/update-transaction-byexternal.use-case';
import {
  TransactionEntity,
  TransactionExternalParams,
} from 'src/modules/transaction/domain/entities/transaction.entity';
import { BadRequestException } from '@nestjs/common';

describe('UpdateTransactionWebhookUseCase', () => {
  let useCase: UpdateTransactionWebhookUseCase;
  let updateTransactionByIdExternalUseCase: UpdateTransactionByIdExternalUseCase;

  const mockTransaction: TransactionEntity = {
    id: '1',
    userId: 'user-1',
    productId: 'product-1',
    price: 100,
    status: 'APPROVED',
    referenceInternalTransaction: 'ref-internal-1',
    idExternalTransaction: 'ext-tx-1',
    amount: 100,
    methodPayment: 'CARD',
  };

  const mockTransactionExternalParams: Partial<TransactionExternalParams> = {
    data: {
      id: 'ext-tx-1',
      status: 'APPROVED',
    },
  };

  beforeEach(async () => {
    const updateTransactionByIdExternalUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionWebhookUseCase,
        {
          provide: UpdateTransactionByIdExternalUseCase,
          useValue: updateTransactionByIdExternalUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTransactionWebhookUseCase>(
      UpdateTransactionWebhookUseCase,
    );
    updateTransactionByIdExternalUseCase =
      module.get<UpdateTransactionByIdExternalUseCase>(
        UpdateTransactionByIdExternalUseCase,
      );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a transaction successfully', async () => {
      // Arrange
      jest
        .spyOn(updateTransactionByIdExternalUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await useCase.execute(mockTransactionExternalParams);

      // Assert
      expect(updateTransactionByIdExternalUseCase.execute).toHaveBeenCalledWith(
        mockTransactionExternalParams,
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw BadRequestException when transaction data is not provided', async () => {
      // Act & Assert
      await expect(useCase.execute(null)).rejects.toThrow(BadRequestException);
    });

    it('should pass through errors from the underlying use case', async () => {
      // Arrange
      const expectedError = new Error('Failed to update transaction');
      jest
        .spyOn(updateTransactionByIdExternalUseCase, 'execute')
        .mockRejectedValue(expectedError);

      // Act & Assert
      await expect(
        useCase.execute(mockTransactionExternalParams),
      ).rejects.toThrow(expectedError);
    });
  });
});
