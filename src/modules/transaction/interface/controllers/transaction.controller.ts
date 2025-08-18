import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionByIdUseCase } from '../../application/use-cases/get-transaction-id.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionDto) {
    const transactionData = {
      amount: body.amount,
      userId: body.userId,
      methodPayment: body.methodPayment,
      productId: body.productId,
      price: body.price,
    };
    const token_card = body.token_card;
    const acceptance_token = body.acceptance_token;
    const installments = body.installments;

    return this.createUseCase.execute(
      transactionData,
      token_card,
      acceptance_token,
      installments,
    );
  }
  @Get(':id')
  async getTransactionById(@Body('id') id: string) {
    return this.getTransactionByIdUseCase.execute(id);
  }
  @Get('internal/:idInternal')
  async getTransactionByInternalId(@Body('idInternal') idInternal: string) {
    return this.getTransactionByIdUseCase.execute(idInternal);
  }
}
