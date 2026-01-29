import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomersController } from './interface/controllers/customers.controller';
import { CustomerModel } from './infrastructure/database/customer.model';
import { CustomersRepository } from './domain/repositories/customers.repository';
import { CustomersRepositoryImpl } from './infrastructure/database/customers.repository.impl';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { GetAllCustomersUseCase } from './application/use-cases/get-all-customers.use-case';

@Module({
  imports: [SequelizeModule.forFeature([CustomerModel])],
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    GetCustomerByIdUseCase,
    GetAllCustomersUseCase,
    {
      provide: CustomersRepository,
      useClass: CustomersRepositoryImpl,
    },
  ],
  exports: [CustomersRepository],
})
export class CustomersModule {}
