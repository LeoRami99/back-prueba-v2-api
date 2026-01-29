import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
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
  // getTransactionById(id: string): Promise<TransactionEntity | null> {
  //   throw new Error('Method not implemented.');
  // }
  // getTransactionByIdInternal(
  //   idInternal: string,
  // ): Promise<TransactionEntity | null> {
  //   throw new Error('Method not implemented.');
  // }
  async create(
    transactionData: Partial<TransactionExternal>,
  ): Promise<ApiPaymentResult> {
    try {
      const url = process.env.UAT_SANDBOX_URL as string;
      if (!url) {
        throw new UnprocessableEntityException(
          'UAT_SANDBOX_URL is not defined',
        );
      }
      const uri = `${url}/transactions`;
      if (!transactionData) {
        throw new UnprocessableEntityException('Transaction data is required');
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
        throw new BadGatewayException('Empty response from payment provider');
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: any };
        message?: string;
      };

      const status = axiosError?.response?.status;
      const providerMessage =
        axiosError?.response?.data?.error?.reason ??
        axiosError?.response?.data?.error?.message ??
        axiosError?.response?.data?.message ??
        axiosError?.message ??
        'Unknown error';

      if (status === 400) {
        throw new BadRequestException({
          message: 'Invalid payment payload',
          providerMessage,
        });
      }
      if (status === 422) {
        throw new UnprocessableEntityException({
          message: 'Payment rejected by provider',
          providerMessage,
        });
      }
      if (status && status >= 400 && status < 500) {
        throw new BadRequestException({
          message: 'Client error from provider',
          providerMessage,
        });
      }
      if (status && status >= 500) {
        throw new BadGatewayException({
          message: 'Provider error creating transaction',
          providerMessage,
        });
      }

      throw new InternalServerErrorException({
        message: 'Unexpected error creating external transaction',
        providerMessage,
      });
    }
  }
}
