// src/products/dto/get-products.dto.ts
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductsDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize: number;

  @ApiPropertyOptional({ example: 'phone' })
  @IsOptional()
  @IsString()
  filter?: string;
}
