import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import {
  TransactionEntity,
  TransactionExternalParams,
} from '../../domain/entities/transaction.entity';
import { UpdateStockUseCase } from '../../../products/application/use-cases/update-stock.use-case';

@Injectable()
export class UpdateTransactionByIdExternalUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly updateStockUseCase: UpdateStockUseCase,
  ) {}

  async execute(
    transactionData: Partial<TransactionExternalParams>,
  ): Promise<TransactionEntity> {
    if (!transactionData) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Transaction data is required',
      });
    }
    console.log('Updating transaction with data:', transactionData);
    if (!transactionData.idEsternalTransaction || !transactionData.status) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'External transaction id and status are required',
      });
    }

    const normalizedStatus = transactionData.status.toUpperCase();
    const allowedStatuses = new Set([
      'PENDING',
      'APPROVED',
      'REJECTED',
      'CANCELED',
    ]);
    if (!allowedStatuses.has(normalizedStatus)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid transaction status',
      });
    }

    const transactionCheck =
      await this.transactionRepository.getTransactionByIdExternal(
        transactionData.idEsternalTransaction,
      );

    const transaction =
      await this.transactionRepository.updateTransactionByExternalTransaction(
        transactionData.idEsternalTransaction,
        normalizedStatus,
      );

    if (!transaction) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error updating transaction',
      });
    }

    if (normalizedStatus === 'APPROVED') {
      if (!transactionCheck) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Transaction not found',
        });
      }

      const isUpdatedStock = await this.updateStockUseCase.execute(
        transactionCheck.productId,
        transactionCheck.amount,
      );

      if (!isUpdatedStock) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Error updating product stock',
        });
      }
    }

    return transaction;
  }
}
