import { Module } from '@nestjs/common';
import { TransactionController } from './interface/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import {
  TransactionExternalRepository,
  TransactionRepository,
} from './domain/repositories/transaction.repository';
import { TransactionRepositoryImpl } from './infrastructure/database/transaction.repository.impl';
import { GetTransactionByInternalIdUseCase } from './application/use-cases/get-transaction-internal-id.use-case';
import { GetTransactionByIdUseCase } from './application/use-cases/get-transaction-id.use-case';
import { TransactionExternalRepositoryImpl } from './infrastructure/http/transaction.externals.repository.impl';
import { CreateExternalTransactionUseCase } from './application/use-cases/create-external-transaction.use-case';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from './infrastructure/database/transaction.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel]), HttpModule],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    GetTransactionByInternalIdUseCase,
    CreateExternalTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: TransactionExternalRepository,
      useClass: TransactionExternalRepositoryImpl, // Assuming this is defined in the same module or imported correctly
    },
  ],
})
export class TransactionModule {}
