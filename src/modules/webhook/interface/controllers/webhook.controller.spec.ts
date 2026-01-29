import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { UpdateTransactionWebhookUseCase } from '../../application/use-cases/update-transaction-webhook.use-case';
import { TransactionEntity } from 'src/modules/transaction/domain/entities/transaction.entity';

describe('WebhookController', () => {
  let controller: WebhookController;
  let updateTransactionWebhookUseCase: UpdateTransactionWebhookUseCase;

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
    data: {
      transaction: {
        id: 'ext-tx-1',
        status: 'APPROVED',
        amount_in_cents: 12000,
      },
    },
    event: 'transaction.updated',
    sent_at: '2025-08-19T10:00:00.000Z',
    signature: {
      checksum: 'abcdef1234567890',
      properties: [
        'transaction.id',
        'transaction.status',
        'transaction.amount_in_cents',
      ],
    },
    timestamp: 1660123456,
    environment: 'test',
  };

  beforeEach(async () => {
    const updateTransactionWebhookUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: UpdateTransactionWebhookUseCase,
          useValue: updateTransactionWebhookUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    updateTransactionWebhookUseCase =
      module.get<UpdateTransactionWebhookUseCase>(
        UpdateTransactionWebhookUseCase,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should process webhook and update transaction successfully', async () => {
      // Arrange
      jest
        .spyOn(updateTransactionWebhookUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await controller.create(mockWebhookPayload);

      // Assert
      expect(updateTransactionWebhookUseCase.execute).toHaveBeenCalledWith(
        mockWebhookPayload,
        undefined,
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should handle errors when updating transaction fails', async () => {
      // Arrange
      const expectedError = new Error('Failed to update transaction');
      jest
        .spyOn(updateTransactionWebhookUseCase, 'execute')
        .mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.create(mockWebhookPayload)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
