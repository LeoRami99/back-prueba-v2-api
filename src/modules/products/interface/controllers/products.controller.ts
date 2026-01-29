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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly getAllProducta: GetAllProductsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List products with pagination' })
  @ApiResponse({ status: 200, description: 'Products list' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async finAll(@Query() query: GetProductsDto) {
    const { page = 1, pageSize = 5, filter = undefined } = query;
    return this.getAllProducta.execute(page, pageSize, filter);
  }
}
