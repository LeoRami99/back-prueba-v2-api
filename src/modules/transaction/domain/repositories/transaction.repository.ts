import { ApiPaymentResult } from '../../interface/types/api.result.external.transaction';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionExternal } from '../entities/transaction.external.entity';

export abstract class TransactionRepository {
  abstract create(
    data: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null>;
  abstract getTransactionById(id: string): Promise<TransactionEntity | null>;
  abstract getTransactionByIdInternal(
    idInternal: string,
  ): Promise<TransactionEntity | null>;
}

export abstract class TransactionExternalRepository {
  abstract create(
    data: Partial<TransactionExternal>,
  ): Promise<ApiPaymentResult | null>;
  // abstract getTransactionById(id: string): Promise<TransactionEntity | null>;
  // abstract getTransactionByIdInternal(
  //   idInternal: string,
  // ): Promise<TransactionEntity | null>;
}
