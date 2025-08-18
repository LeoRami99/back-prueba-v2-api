import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  async execute(id: string): Promise<TransactionEntity | null> {
    if (!id) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Transaction ID is required',
      });
    }
    const transaction = await this.transactionRepository.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Transaction not found',
      });
    }
    return transaction;
  }
}
