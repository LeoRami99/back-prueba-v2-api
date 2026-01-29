import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionByIdUseCase } from '../../application/use-cases/get-transaction-id.use-case';
import { GetTransactionByInternalIdUseCase } from '../../application/use-cases/get-transaction-internal-id.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getTransactionByInternalIdUseCase: GetTransactionByInternalIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction and start payment flow' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 500, description: 'Server error' })
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
  @Get('internal/:idInternal')
  @ApiOperation({ summary: 'Get transaction by internal reference' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionByInternalId(@Param('idInternal') idInternal: string) {
    return this.getTransactionByInternalIdUseCase.execute(idInternal);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionById(@Param('id') id: string) {
    return this.getTransactionByIdUseCase.execute(id);
  }
}
