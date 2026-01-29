import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class GetAllCustomersUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(): Promise<CustomerEntity[]> {
    return this.customersRepository.getAll();
  }
}
