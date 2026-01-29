import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    if (!data || !data.name || !data.email) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'name and email are required',
      });
    }

    try {
      const created = await this.customersRepository.create(data);
      if (!created) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Error creating customer',
        });
      }
      return created;
    } catch (error: unknown) {
      const message = (error as Error)?.message ?? 'Unknown error';
      if (message.toLowerCase().includes('unique')) {
        throw new ConflictException({
          statusCode: 409,
          message: 'Customer email already exists',
        });
      }
      throw error;
    }
  }
}
