import {
  Controller,
  Post,
  Body,
  HttpCode,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateTransactionWebhookUseCase } from '../../application/use-cases/update-transaction-webhook.use-case';
import { WebhookDataDto } from '../dtos/webhook-externat.dto';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly updateTransactionWebhook: UpdateTransactionWebhookUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() body: WebhookDataDto,
    @Headers('x-event-checksum') checksumHeader?: string,
  ) {
    return this.updateTransactionWebhook.execute(body, checksumHeader);
  }
}
