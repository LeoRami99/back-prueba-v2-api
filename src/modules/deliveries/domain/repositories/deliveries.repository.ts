import { DeliveryEntity } from '../entities/delivery.entity';

export abstract class DeliveriesRepository {
  abstract create(
    data: Partial<DeliveryEntity>,
  ): Promise<DeliveryEntity | null>;
  abstract getById(id: string): Promise<DeliveryEntity | null>;
  abstract updateStatus(
    id: string,
    status: string,
  ): Promise<DeliveryEntity | null>;
  abstract getAll(): Promise<DeliveryEntity[]>;
}
