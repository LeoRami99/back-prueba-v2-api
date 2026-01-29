import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryStatusDto {
  @ApiProperty({ example: 'shipped', enum: ['pending', 'shipped', 'delivered', 'canceled'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'shipped', 'delivered', 'canceled'])
  status: string;
}
