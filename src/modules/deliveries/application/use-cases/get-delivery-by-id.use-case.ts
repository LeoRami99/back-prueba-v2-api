import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveriesRepository } from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

@Injectable()
export class GetDeliveryByIdUseCase {
  constructor(private readonly deliveriesRepository: DeliveriesRepository) {}

  async execute(id: string): Promise<DeliveryEntity> {
    if (!id) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Delivery ID is required',
      });
    }
    const delivery = await this.deliveriesRepository.getById(id);
    if (!delivery) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Delivery not found',
      });
    }
    return delivery;
  }
}
