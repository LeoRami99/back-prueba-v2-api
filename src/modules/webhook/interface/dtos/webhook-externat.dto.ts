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

export class PaymentMethodExtraThreeDsAuthDto {
  @IsString()
  @IsNotEmpty()
  current_step: string;

  @IsString()
  @IsNotEmpty()
  current_step_status: string;
}

export class PaymentMethodExtraDto {
  @IsString()
  @IsNotEmpty()
  bin: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  exp_year: string;

  @IsString()
  @IsNotEmpty()
  card_type: string;

  @IsString()
  @IsNotEmpty()
  exp_month: string;

  @IsString()
  @IsNotEmpty()
  last_four: string;

  @IsString()
  @IsNotEmpty()
  card_holder: string;

  @IsOptional()
  @IsString()
  unique_code: string;

  @IsOptional()
  is_three_ds: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethodExtraThreeDsAuthDto)
  three_ds_auth: PaymentMethodExtraThreeDsAuthDto;

  @IsOptional()
  three_ds_auth_type: string | null;

  @IsString()
  @IsNotEmpty()
  external_identifier: string;

  @IsString()
  @IsNotEmpty()
  processor_response_code: string;
}

export class PaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodExtraDto)
  extra: PaymentMethodExtraDto;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;
}

export class TransactionDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  origin: string | null;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  created_at: string;

  @IsOptional()
  billing_data: any;

  @IsString()
  @IsNotEmpty()
  finalized_at: string;

  @IsString()
  @IsNotEmpty()
  redirect_url: string;

  @IsOptional()
  customer_data: any;

  @IsEmail()
  @IsNotEmpty()
  customer_email: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;

  @IsOptional()
  status_message: string | null;

  @IsNumber()
  @IsNotEmpty()
  amount_in_cents: number;

  @IsOptional()
  payment_link_id: string | null;

  @IsOptional()
  shipping_address: string | null;

  @IsOptional()
  payment_source_id: string | null;

  @IsString()
  @IsNotEmpty()
  payment_method_type: string;
}

export class SignatureDto {
  @IsString()
  @IsNotEmpty()
  checksum: string;

  @IsArray()
  @IsString({ each: true })
  properties: string[];
}

export class WebhookDataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDataDto)
  @IsNotEmpty()
  data: {
    transaction: TransactionDataDto;
  };

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsString()
  @IsNotEmpty()
  sent_at: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SignatureDto)
  signature: SignatureDto;

  @IsInt()
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  environment: string;
}
