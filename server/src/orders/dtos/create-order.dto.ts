import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  billingAddress: string;

  // Optional: Payment method (mocked)
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
