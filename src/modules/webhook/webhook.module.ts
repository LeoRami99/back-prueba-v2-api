import { Module } from '@nestjs/common';
import { WebhookController } from './interface/controllers/webhook.controller';
import { UpdateTransactionWebhookUseCase } from './application/use-cases/update-transaction-webhook.use-case';
import { UpdateTransactionByIdExternalUseCase } from '../transaction/application/use-cases/update-transaction-byexternal.use-case';
import { TransactionModule } from '../transaction/transaction.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TransactionModule, ProductsModule],
  controllers: [WebhookController],
  providers: [
    UpdateTransactionWebhookUseCase,
    UpdateTransactionByIdExternalUseCase,
  ],
})
export class WebhookModule {}
