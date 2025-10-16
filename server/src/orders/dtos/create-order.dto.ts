import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'user shipping address',
    example: 'enugu, nigeria',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'user billing address',
    example: 'enugu, nigeria',
  })
  @IsNotEmpty()
  @IsString()
  billingAddress: string;

  @ApiProperty({
    description: 'payment method',
    example: 'credit_card',
  })
  // Optional: Payment method (mocked)
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
