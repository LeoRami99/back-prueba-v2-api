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
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly updateTransactionWebhook: UpdateTransactionWebhookUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Receive Wompi webhook events' })
  @ApiHeader({
    name: 'x-event-checksum',
    required: false,
    description: 'Optional checksum header sent by Wompi',
  })
  @ApiBody({ type: WebhookDataDto })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 401, description: 'Invalid webhook signature' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() body: WebhookDataDto,
    @Headers('x-event-checksum') checksumHeader?: string,
  ) {
    return this.updateTransactionWebhook.execute(body, checksumHeader);
  }
}
