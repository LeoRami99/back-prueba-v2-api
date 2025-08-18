import { IsString, Length, MinLength, MaxLength } from 'class-validator';

export class CardDto {
  @IsString()
  @Length(13, 19)
  number: string;

  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvc: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2)
  exp_month: string;

  @IsString()
  @MinLength(2)
  @MaxLength(4)
  exp_year: string;

  @IsString()
  @MinLength(3)
  card_holder: string;
}
