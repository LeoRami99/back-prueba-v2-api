import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentMethodExtraThreeDsAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  current_step: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  current_step_status: string;
}

export class PaymentMethodExtraDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  exp_year: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  card_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  exp_month: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_four: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  card_holder: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unique_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_three_ds: boolean;

  @ApiPropertyOptional({ type: () => PaymentMethodExtraThreeDsAuthDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethodExtraThreeDsAuthDto)
  three_ds_auth: PaymentMethodExtraThreeDsAuthDto;

  @ApiPropertyOptional()
  @IsOptional()
  three_ds_auth_type: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  external_identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  processor_response_code: string;
}

export class PaymentMethodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: () => PaymentMethodExtraDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodExtraDto)
  extra: PaymentMethodExtraDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  installments: number;
}

export class TransactionDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  origin: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiPropertyOptional()
  @IsOptional()
  billing_data: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  finalized_at: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  redirect_url: string;

  @ApiPropertyOptional()
  @IsOptional()
  customer_data: any;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  customer_email: string;

  @ApiPropertyOptional({ type: () => PaymentMethodDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;

  @ApiPropertyOptional()
  @IsOptional()
  status_message: string | null;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount_in_cents: number;

  @ApiPropertyOptional()
  @IsOptional()
  payment_link_id: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  shipping_address: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  payment_source_id: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payment_method_type: string;
}

export class SignatureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checksum: string;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  properties: string[];
}

export class WebhookDataDto {
  @ApiProperty({ type: () => WebhookTransactionWrapperDto })
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookTransactionWrapperDto)
  @IsNotEmpty()
  data: WebhookTransactionWrapperDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sent_at: string;

  @ApiProperty({ type: () => SignatureDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SignatureDto)
  signature: SignatureDto;

  @ApiProperty()
  @IsInt()
  timestamp: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  environment: string;
}

export class WebhookTransactionWrapperDto {
  @ApiProperty({ type: () => TransactionDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDataDto)
  @IsNotEmpty()
  transaction: TransactionDataDto;
}
