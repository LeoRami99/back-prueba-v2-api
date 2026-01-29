import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveriesRepository } from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

@Injectable()
export class UpdateDeliveryStatusUseCase {
  constructor(private readonly deliveriesRepository: DeliveriesRepository) {}

  async execute(id: string, status: string): Promise<DeliveryEntity> {
    if (!id || !status) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Delivery id and status are required',
      });
    }
    const updated = await this.deliveriesRepository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Delivery not found',
      });
    }
    return updated;
  }
}
