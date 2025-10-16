import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductCategory } from '../enums/product-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'product name',
    example: 'Gold spoons',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'product description',
    example: 'Gold plated variety of spoons',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(350)
  description: string;

  @ApiProperty({
    description: 'product category',
    example: ProductCategory.BAKING,
  })
  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category: ProductCategory;

  @ApiProperty({
    description: 'product price',
    example: 23,
  })
  @IsInt()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'remaining stock of product',
    example: 40,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  stock: number;

  @ApiProperty({
    description: 'product image url',
    example: 'https://unsplash.com',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
