import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeliveryModel } from './infrastructure/database/delivery.model';
import { DeliveriesController } from './interface/controllers/deliveries.controller';
import { DeliveriesRepository } from './domain/repositories/deliveries.repository';
import { DeliveriesRepositoryImpl } from './infrastructure/database/deliveries.repository.impl';
import { CreateDeliveryUseCase } from './application/use-cases/create-delivery.use-case';
import { GetDeliveryByIdUseCase } from './application/use-cases/get-delivery-by-id.use-case';
import { GetAllDeliveriesUseCase } from './application/use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusUseCase } from './application/use-cases/update-delivery-status.use-case';

@Module({
  imports: [SequelizeModule.forFeature([DeliveryModel])],
  controllers: [DeliveriesController],
  providers: [
    CreateDeliveryUseCase,
    GetDeliveryByIdUseCase,
    GetAllDeliveriesUseCase,
    UpdateDeliveryStatusUseCase,
    {
      provide: DeliveriesRepository,
      useClass: DeliveriesRepositoryImpl,
    },
  ],
  exports: [DeliveriesRepository],
})
export class DeliveriesModule {}
