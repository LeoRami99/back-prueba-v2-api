import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
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
  const properties = payload?.signature?.properties ?? [];
  const values = properties.map((property) => {
    const parts = property.split('.');
    let current: unknown;
    if (property.startsWith('transaction.')) {
      current = payload?.data?.transaction ?? {};
      parts.shift();
    } else {
      current = payload?.data ?? {};
    }
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
  private readonly logger = new Logger(UpdateTransactionWebhookUseCase.name);

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
      this.logger.warn(
        `Invalid webhook signature event=${payload?.event} tx=${payload?.data?.transaction?.id}`,
      );
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid webhook signature',
      });
    }

    if (!payload?.data?.transaction?.id || !payload?.data?.transaction?.status) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'External transaction id and status are required',
      });
    }

    this.logger.log(
      `Webhook received event=${payload.event} tx=${payload.data.transaction.id} status=${payload.data.transaction.status}`,
    );

    return await this.updateTransactionByIdExternalUseCase.execute({
      idEsternalTransaction: payload.data.transaction.id,
      status: payload.data.transaction.status,
    } as Partial<TransactionExternalParams>);
  }
}
