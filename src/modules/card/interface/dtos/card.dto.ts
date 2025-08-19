import { IsString, Length, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty({
    description: 'Card number (13-19 digits)',
    example: '4111111111111111',
    minLength: 13,
    maxLength: 19,
  })
  @IsString()
  @Length(13, 19)
  number: string;

  @ApiProperty({
    description: 'Card security code (CVC/CVV)',
    example: '123',
    minLength: 3,
    maxLength: 4,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvc: string;

  @ApiProperty({
    description: 'Expiration month (2 digits)',
    example: '12',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  exp_month: string;

  @ApiProperty({
    description: 'Expiration year (2 or 4 digits)',
    example: '2025',
    minLength: 2,
    maxLength: 4,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(4)
  exp_year: string;

  @ApiProperty({
    description: 'Card holder name',
    example: 'John Doe',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  card_holder: string;
}
