import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateDeliveryUseCase } from '../../application/use-cases/create-delivery.use-case';
import { GetDeliveryByIdUseCase } from '../../application/use-cases/get-delivery-by-id.use-case';
import { GetAllDeliveriesUseCase } from '../../application/use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusUseCase } from '../../application/use-cases/update-delivery-status.use-case';
import { CreateDeliveryDto } from '../dtos/create-delivery.dto';
import { UpdateDeliveryStatusDto } from '../dtos/update-delivery-status.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly getDeliveryByIdUseCase: GetDeliveryByIdUseCase,
    private readonly getAllDeliveriesUseCase: GetAllDeliveriesUseCase,
    private readonly updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateDeliveryDto) {
    return this.createDeliveryUseCase.execute(body);
  }

  @Get()
  async getAll() {
    return this.getAllDeliveriesUseCase.execute();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getDeliveryByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryStatusDto,
  ) {
    return this.updateDeliveryStatusUseCase.execute(id, body.status);
  }
}
