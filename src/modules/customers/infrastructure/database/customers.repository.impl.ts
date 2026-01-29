import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerModel } from './customer.model';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomersRepositoryImpl implements CustomersRepository {
  constructor(
    @InjectModel(CustomerModel)
    private readonly customerModel: typeof CustomerModel,
  ) {}

  async create(
    data: Partial<CustomerEntity>,
  ): Promise<CustomerEntity | null> {
    const created = await this.customerModel.create(
      data as CustomerModel,
    );
    return created as unknown as CustomerEntity;
  }

  async getById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      return null;
    }
    return customer as unknown as CustomerEntity;
  }

  async getAll(): Promise<CustomerEntity[]> {
    const customers = await this.customerModel.findAll();
    return customers as unknown as CustomerEntity[];
  }
}
