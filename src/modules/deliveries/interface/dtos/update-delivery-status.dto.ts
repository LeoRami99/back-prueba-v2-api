import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'shipped', 'delivered', 'canceled'])
  status: string;
}
