import {
  Controller,
  Body,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { GetProductsDto } from '../dtos/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly getAllProducta: GetAllProductsUseCase) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async finAll(@Query() query: GetProductsDto) {
    const { page = 1, pageSize = 5, filter = undefined } = query;
    return this.getAllProducta.execute(page, pageSize, filter);
  }
}
