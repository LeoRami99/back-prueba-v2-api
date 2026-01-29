import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/get-customer-by-id.use-case';
import { GetAllCustomersUseCase } from '../../application/use-cases/get-all-customers.use-case';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async create(@Body() body: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiResponse({ status: 200, description: 'Customers list' })
  async getAll() {
    return this.getAllCustomersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getById(@Param('id') id: string) {
    return this.getCustomerByIdUseCase.execute(id);
  }
}
