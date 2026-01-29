import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeliveriesRepository } from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private readonly deliveriesRepository: DeliveriesRepository) {}

  async execute(data: Partial<DeliveryEntity>): Promise<DeliveryEntity> {
    if (
      !data ||
      !data.addressLine1 ||
      !data.city ||
      !data.country ||
      !data.postalCode ||
      !data.customerId ||
      !data.transactionId
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Delivery address and ids are required',
      });
    }

    const created = await this.deliveriesRepository.create(data);
    if (!created) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error creating delivery',
      });
    }
    return created;
  }
}
