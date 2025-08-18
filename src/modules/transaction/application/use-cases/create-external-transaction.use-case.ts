import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionExternalRepository } from '../../domain/repositories/transaction.repository';

import { TransactionExternal } from '../../domain/entities/transaction.external.entity';

import { ApiPaymentResult } from '../../interface/types/api.result.external.transaction';

@Injectable()
export class CreateExternalTransactionUseCase {
  constructor(
    private readonly transactionExternalRepository: TransactionExternalRepository,
  ) {}

  async execute(
    transactionData: Partial<TransactionExternal>,
  ): Promise<ApiPaymentResult> {
    if (!transactionData) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Transaction data is required',
      });
    }

    const transaction =
      await this.transactionExternalRepository.create(transactionData);
    if (!transaction) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error creating external transaction',
      });
    }

    return transaction;
  }
}
