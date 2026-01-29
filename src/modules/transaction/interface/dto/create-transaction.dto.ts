import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 1, description: 'Units to charge/assign' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'f6f51b8f-8b6f-4e7e-93f0-12c0fbde12c1' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'CARD' })
  @IsNotEmpty()
  @IsString()
  methodPayment: string;

  @ApiProperty({ example: '7a1b2c3d-4e5f-6789-0123-456789abcdef' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 10000, description: 'Price per unit' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceInternalTransaction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idExternalTransaction?: string;

  @ApiProperty({ example: 'tkn_test_123' })
  @IsNotEmpty()
  @IsString()
  token_card?: string;

  @ApiProperty({ example: 'acceptance_token_123' })
  @IsNotEmpty()
  @IsString()
  acceptance_token?: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 36 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(36)
  installments?: number;
}
