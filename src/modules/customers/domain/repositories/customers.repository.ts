import { CustomerEntity } from '../entities/customer.entity';

export abstract class CustomersRepository {
  abstract create(
    data: Partial<CustomerEntity>,
  ): Promise<CustomerEntity | null>;
  abstract getById(id: string): Promise<CustomerEntity | null>;
  abstract getAll(): Promise<CustomerEntity[]>;
}
