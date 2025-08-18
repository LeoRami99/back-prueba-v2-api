import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
} from 'class-validator';

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
  @IsString()
  token_card?: string;

  @IsNotEmpty()
  @IsString()
  @IsString()
  acceptance_token?: string;

  @IsNotEmpty()
  @IsString()
  @IsString()
  installments?: number;
}
