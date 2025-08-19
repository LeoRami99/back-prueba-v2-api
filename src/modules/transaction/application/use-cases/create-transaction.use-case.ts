import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionExternal } from '../../domain/entities/transaction.external.entity';
import { IVA } from '../../../../helpers/tax';
import { convertToCents } from '../../../../utils/convertToCents';
import { generateIdInternalTransaction } from '../../../../utils/generateIdInternalTransaction';
import { hash256Signature } from '../../../../utils/hash256';
import { CreateExternalTransactionUseCase } from './create-external-transaction.use-case';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly createExternalTransactionUseCase: CreateExternalTransactionUseCase,
  ) {}
  async execute(
    transactionData: Partial<TransactionEntity>,
    token_card?: string,
    acceptance_token?: string,
    installments?: number,
  ): Promise<TransactionEntity> {
    if (!transactionData) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Transaction data is required',
      });
    }
    // const transaction =
    //   await this.transactionRepository.create(transactionData);
    // if (!transaction) {
    //   throw new HttpException(
    //     {
    //       statusCode: 400,
    //       message: 'Error creating transaction',
    //     },
    //     400,
    //   );
    // }
    // return transaction;

    const integrityKey = process.env.INTEGRITY_KEY;
    if (!integrityKey) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Integrity key not found',
      });
    }

    if (!transactionData.price) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Price is required',
      });
    }

    const priceWithIVA = transactionData.price * IVA;
    if (!priceWithIVA) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Price with IVA is error',
      });
    }

    const totalPriceWithIVA = (transactionData.price + priceWithIVA).toFixed(0);

    const priceCents = convertToCents(Number(totalPriceWithIVA));

    const idReferenceInternal = generateIdInternalTransaction(
      transactionData?.productId || '',
      new Date(),
    );

    if (!idReferenceInternal) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error generating internal transaction ID',
      });
    }

    const signature = await hash256Signature(
      idReferenceInternal,
      priceCents.toString(),
      'COP',
      integrityKey,
    );
    if (!process.env.REDIRECT_FRONT_TX) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Redirect URL front not found',
      });
    }

    const externalPayload = {
      acceptance_token: acceptance_token,
      amount_in_cents: priceCents,
      currency: 'COP',
      signature: signature,
      reference: idReferenceInternal,
      customer_email: 'pruebasensandbox@yopmail.com',
      redirect_url: process.env.REDIRECT_FRONT_TX,
      payment_method: {
        type: 'CARD',
        installments: installments,
        token: token_card,
      },
    } as Partial<TransactionExternal>;

    const transactionDataExternal =
      await this.createExternalTransactionUseCase.execute(externalPayload);

    if (!transactionDataExternal) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error creating external transaction',
      });
    }

    const transactionInternal = await this.transactionRepository.create({
      ...transactionData,
      referenceInternalTransaction: idReferenceInternal,
      idExternalTransaction: transactionDataExternal.data.id,
    });
    if (!transactionInternal) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error creating internal transaction',
      });
    }

    return transactionInternal;
  }
}
