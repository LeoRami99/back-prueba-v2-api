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

export class GetProductsDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize: number;

  @IsOptional()
  @IsString()
  filter?: string;
}
