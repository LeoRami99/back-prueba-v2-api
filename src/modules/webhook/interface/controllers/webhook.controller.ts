import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UpdateTransactionWebhookUseCase } from '../../application/use-cases/update-transaction-webhook.use-case';
// import { WebhookDataDto } from '../dtos/webhook-externat.dto';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly updateTransactionWebhook: UpdateTransactionWebhookUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async create(@Body() body: any) {
    return this.updateTransactionWebhook.execute({
      idEsternalTransaction: body?.data.transaction.id,
      status: body?.data.transaction.status,
    });
  }
}
