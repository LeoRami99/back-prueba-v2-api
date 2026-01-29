import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { DeliveryModel } from './delivery.model';
import { DeliveriesRepository } from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

@Injectable()
export class DeliveriesRepositoryImpl implements DeliveriesRepository {
  constructor(
    @InjectModel(DeliveryModel)
    private readonly deliveryModel: typeof DeliveryModel,
  ) {}

  async create(
    data: Partial<DeliveryEntity>,
  ): Promise<DeliveryEntity | null> {
    const created = await this.deliveryModel.create(
      data as DeliveryModel,
    );
    return created as unknown as DeliveryEntity;
  }

  async getById(id: string): Promise<DeliveryEntity | null> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      return null;
    }
    return delivery as unknown as DeliveryEntity;
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<DeliveryEntity | null> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      return null;
    }
    const updated = await delivery.update({ status });
    return updated as unknown as DeliveryEntity;
  }

  async getAll(): Promise<DeliveryEntity[]> {
    const deliveries = await this.deliveryModel.findAll();
    return deliveries as unknown as DeliveryEntity[];
  }
}
