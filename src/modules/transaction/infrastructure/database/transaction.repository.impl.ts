import { TransactionModel } from './transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionModel: typeof TransactionModel,
    private readonly sequelize: Sequelize,
  ) {}
  async create(
    data: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    const t = await this.sequelize.transaction();

    try {
      const transaction = await this.transactionModel.create(
        data as TransactionModel,
        {
          transaction: t,
        },
      );

      if (!transaction) {
        await t.rollback();
        return null;
      }

      await t.commit();
      return transaction as unknown as TransactionEntity;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async getTransactionById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.transactionModel.findByPk(id);
    if (!transaction) {
      return null;
    }
    return transaction as unknown as TransactionEntity;
  }
  async getTransactionByIdInternal(
    idInternal: string,
  ): Promise<TransactionEntity | null> {
    const transaction = await this.transactionModel.findOne({
      where: { referenceInternalTransaction: idInternal },
    });
    if (!transaction) {
      return null;
    }
    return transaction as unknown as TransactionEntity;
  }
}
