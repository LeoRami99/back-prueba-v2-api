// src/products/dto/get-products.dto.ts
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  pageSize: number;

  @IsOptional()
  @IsString()
  filter?: string;
}
