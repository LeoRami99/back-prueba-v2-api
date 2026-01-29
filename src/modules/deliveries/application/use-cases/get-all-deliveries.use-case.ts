import { Injectable } from '@nestjs/common';
import { DeliveriesRepository } from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

@Injectable()
export class GetAllDeliveriesUseCase {
  constructor(private readonly deliveriesRepository: DeliveriesRepository) {}

  async execute(): Promise<DeliveryEntity[]> {
    return this.deliveriesRepository.getAll();
  }
}
