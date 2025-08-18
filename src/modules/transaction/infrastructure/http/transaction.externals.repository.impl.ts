import { Injectable } from '@nestjs/common';
import { TransactionExternalRepository } from '../../domain/repositories/transaction.repository';
import { HttpService } from '@nestjs/axios';
import { TransactionExternal } from '../../domain/entities/transaction.external.entity';
import { ApiPaymentResult } from '../../interface/types/api.result.external.transaction';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionExternalRepositoryImpl
  implements TransactionExternalRepository
{
  constructor(private readonly httpService: HttpService) {}
  async create(
    transactionData: Partial<TransactionExternal>,
  ): Promise<ApiPaymentResult> {
    const url = process.env.UAT_SANDBOX_URL as string;
    if (!url) {
      throw new Error('UAT_SANDBOX_URL is not defined');
    }
    const uri = `${url}/transactions`;
    if (!transactionData) {
      throw new Error('Transaction data is required');
    }
    const response = await firstValueFrom(
      this.httpService.post<ApiPaymentResult>(uri, transactionData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PRIVATE_KEY as string}`,
        },
      }),
    );
    if (!response?.data) {
      throw new Error('Error creating transaction');
    }

    return response.data as ApiPaymentResult;
  }
}
