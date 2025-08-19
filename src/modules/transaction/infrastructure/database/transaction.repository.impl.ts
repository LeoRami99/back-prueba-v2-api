import { TransactionModel } from './transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UniqueConstraintError, ValidationError } from 'sequelize';

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
    } catch (error: unknown) {
      await t.rollback();
      throw new InternalServerErrorException(
        `Error creating transaction in database`,
        error instanceof Error ? error.message : 'Unknown error',
      );
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
  async updateTransactionByExternalTransaction(
    idExternalTransaction: string,
    status: string,
  ): Promise<TransactionEntity> {
    try {
      return await this.sequelize.transaction(async (tx) => {
        const current = await this.transactionModel.findOne({
          where: { idExternalTransaction },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!current) {
          throw new NotFoundException({
            code: 'TX_NOT_FOUND',
            message: `Transaction with idExternalTransaction=${idExternalTransaction} not found`,
          });
        }

        const [count, rows] = await this.transactionModel.update(
          { status: status.toLowerCase() },
          {
            where: { idExternalTransaction },
            returning: true,
            transaction: tx,
          },
        );

        if (count === 0 || !rows?.[0]) {
          throw new UnprocessableEntityException({
            code: 'TX_NOT_UPDATED',
            message: `Transaction with idExternalTransaction=${idExternalTransaction} was not updated`,
          });
        }

        return rows[0] as unknown as TransactionEntity;
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof UniqueConstraintError) {
        throw new ConflictException({
          code: 'UNIQUE_CONSTRAINT',
          message: error.message,
        });
      }
      if (error instanceof ValidationError) {
        throw new UnprocessableEntityException({
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.errors?.map((e) => ({ path: e.path, msg: e.message })),
        });
      }
      throw new InternalServerErrorException({
        code: 'TX_UPDATE_ERROR',
        message: `Error updating transaction with idExternalTransaction=${idExternalTransaction}`,
        cause: (error as Error)?.message ?? 'Unknown error',
      });
    }
  }
  async getTransactionByIdExternal(
    idExternal: string,
  ): Promise<TransactionEntity | null> {
    const transaction = await this.transactionModel.findOne({
      where: { idExternalTransaction: idExternal },
      raw: true,
    });

    if (!transaction) {
      return null;
    }

    return transaction as unknown as TransactionEntity;
  }
}
