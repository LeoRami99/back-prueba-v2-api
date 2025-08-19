import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTransactionByIdExternalUseCase } from '../../../transaction/application/use-cases/update-transaction-byexternal.use-case';

import {
  TransactionEntity,
  TransactionExternalParams,
} from 'src/modules/transaction/domain/entities/transaction.entity';

@Injectable()
export class UpdateTransactionWebhookUseCase {
  constructor(
    private readonly updateTransactionByIdExternalUseCase: UpdateTransactionByIdExternalUseCase,
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

    return await this.updateTransactionByIdExternalUseCase.execute(
      transactionData,
    );
  }
}
