import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateDeliveryUseCase } from '../../application/use-cases/create-delivery.use-case';
import { GetDeliveryByIdUseCase } from '../../application/use-cases/get-delivery-by-id.use-case';
import { GetAllDeliveriesUseCase } from '../../application/use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusUseCase } from '../../application/use-cases/update-delivery-status.use-case';
import { CreateDeliveryDto } from '../dtos/create-delivery.dto';
import { UpdateDeliveryStatusDto } from '../dtos/update-delivery-status.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly getDeliveryByIdUseCase: GetDeliveryByIdUseCase,
    private readonly getAllDeliveriesUseCase: GetAllDeliveriesUseCase,
    private readonly updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a delivery' })
  @ApiResponse({ status: 201, description: 'Delivery created' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async create(@Body() body: CreateDeliveryDto) {
    return this.createDeliveryUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'List deliveries' })
  @ApiResponse({ status: 200, description: 'Deliveries list' })
  async getAll() {
    return this.getAllDeliveriesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by id' })
  @ApiResponse({ status: 200, description: 'Delivery found' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async getById(@Param('id') id: string) {
    return this.getDeliveryByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update delivery status' })
  @ApiResponse({ status: 200, description: 'Delivery updated' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryStatusDto,
  ) {
    return this.updateDeliveryStatusUseCase.execute(id, body.status);
  }
}
