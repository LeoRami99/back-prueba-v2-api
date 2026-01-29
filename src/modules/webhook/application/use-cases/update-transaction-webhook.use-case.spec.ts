import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionWebhookUseCase } from './update-transaction-webhook.use-case';
import { UpdateTransactionByIdExternalUseCase } from '../../../transaction/application/use-cases/update-transaction-byexternal.use-case';
import {
  TransactionEntity,
} from 'src/modules/transaction/domain/entities/transaction.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';

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

  const mockWebhookPayload = {
    event: 'transaction.updated',
    data: {
      transaction: {
        id: 'ext-tx-1',
        status: 'APPROVED',
        amount_in_cents: 12000,
      },
    },
    sent_at: '2026-01-29T04:13:40.425Z',
    timestamp: 1769660020,
    signature: {
      checksum: '',
      properties: [
        'transaction.id',
        'transaction.status',
        'transaction.amount_in_cents',
      ],
    },
    environment: 'stagtest',
  };

  const buildChecksum = (secret: string) => {
    const values = [
      mockWebhookPayload.data.transaction.id,
      mockWebhookPayload.data.transaction.status,
      mockWebhookPayload.data.transaction.amount_in_cents,
    ];
    const chain = `${values.join('')}${mockWebhookPayload.timestamp}${secret}`;
    return createHash('sha256').update(chain).digest('hex');
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

    process.env.EVENTS_SECRET = 'events-secret';
    mockWebhookPayload.signature.checksum = buildChecksum(
      process.env.EVENTS_SECRET,
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
      const result = await useCase.execute(mockWebhookPayload);

      // Assert
      expect(updateTransactionByIdExternalUseCase.execute).toHaveBeenCalledWith(
        {
          idEsternalTransaction: 'ext-tx-1',
          status: 'APPROVED',
        },
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw BadRequestException when transaction data is not provided', async () => {
      // Act & Assert
      await expect(useCase.execute(null)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when signature is invalid', async () => {
      const badPayload = {
        ...mockWebhookPayload,
        signature: {
          ...mockWebhookPayload.signature,
          checksum: 'invalid',
        },
      };
      await expect(useCase.execute(badPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should pass through errors from the underlying use case', async () => {
      // Arrange
      const expectedError = new Error('Failed to update transaction');
      jest
        .spyOn(updateTransactionByIdExternalUseCase, 'execute')
        .mockRejectedValue(expectedError);

      // Act & Assert
      await expect(
        useCase.execute(mockWebhookPayload),
      ).rejects.toThrow(expectedError);
    });
  });
});
