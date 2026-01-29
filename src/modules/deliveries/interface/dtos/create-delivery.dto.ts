import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Apto 301' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'CO' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: '110111' })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'f6f51b8f-8b6f-4e7e-93f0-12c0fbde12c1' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '7a1b2c3d-4e5f-6789-0123-456789abcdef' })
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;
}
