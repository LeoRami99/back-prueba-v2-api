import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateTransactionByIdExternalUseCase } from '../../../transaction/application/use-cases/update-transaction-byexternal.use-case';
import { createHash } from 'crypto';

import {
  TransactionEntity,
  TransactionExternalParams,
} from 'src/modules/transaction/domain/entities/transaction.entity';
import { WebhookDataDto } from '../../interface/dtos/webhook-externat.dto';

const buildWebhookSignature = (
  payload: WebhookDataDto,
  secret: string,
): string => {
  const base = payload?.data ?? {};
  const properties = payload?.signature?.properties ?? [];
  const values = properties.map((property) => {
    const parts = property.split('.');
    let current: unknown = base;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = undefined;
        break;
      }
    }
    return current ?? '';
  });

  const chain = `${values.join('')}${payload.timestamp}${secret}`;
  return createHash('sha256').update(chain).digest('hex');
};

@Injectable()
export class UpdateTransactionWebhookUseCase {
  constructor(
    private readonly updateTransactionByIdExternalUseCase: UpdateTransactionByIdExternalUseCase,
  ) {}
  async execute(
    payload: WebhookDataDto,
    checksumHeader?: string,
  ): Promise<TransactionEntity> {
    if (!payload) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Webhook payload is required',
      });
    }
    const secret = process.env.EVENTS_SECRET;
    if (!secret) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'EVENTS_SECRET is not configured',
      });
    }

    const expected = buildWebhookSignature(payload, secret);
    const received =
      checksumHeader?.toLowerCase() ??
      payload.signature?.checksum?.toLowerCase();
    if (!received || expected.toLowerCase() !== received) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid webhook signature',
      });
    }

    return await this.updateTransactionByIdExternalUseCase.execute({
      idEsternalTransaction: payload?.data?.transaction?.id,
      status: payload?.data?.transaction?.status,
    } as Partial<TransactionExternalParams>);
  }
}
