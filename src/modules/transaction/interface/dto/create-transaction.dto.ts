import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  methodPayment: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  referenceInternalTransaction?: string;

  @IsOptional()
  @IsString()
  idExternalTransaction?: string;

  @IsNotEmpty()
  @IsString()
  token_card?: string;

  @IsNotEmpty()
  @IsString()
  acceptance_token?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(36)
  installments?: number;
}
