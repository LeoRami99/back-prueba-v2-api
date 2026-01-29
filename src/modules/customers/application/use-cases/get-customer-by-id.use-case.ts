import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(id: string): Promise<CustomerEntity> {
    if (!id) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Customer ID is required',
      });
    }
    const customer = await this.customersRepository.getById(id);
    if (!customer) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Customer not found',
      });
    }
    return customer;
  }
}
