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
    return this.createUseCase.execute(body);
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
