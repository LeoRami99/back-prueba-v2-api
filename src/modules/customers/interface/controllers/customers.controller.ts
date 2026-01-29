import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/get-customer-by-id.use-case';
import { GetAllCustomersUseCase } from '../../application/use-cases/get-all-customers.use-case';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(body);
  }

  @Get()
  async getAll() {
    return this.getAllCustomersUseCase.execute();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getCustomerByIdUseCase.execute(id);
  }
}
