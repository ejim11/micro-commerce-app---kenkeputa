import { IsIn, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../enums/product-category.enum';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class GetProductsBaseDto {
  /**
   * product name
   */
  @ApiProperty({
    description: 'product name',
    example: 'Gold plated spoons',
  })
  @IsString()
  @IsOptional()
  name?: string;

  /**.
   * product category
   */
  @ApiProperty({
    description: 'product category',
    example: ProductCategory.BAKING,
  })
  @IsString()
  @IsOptional()
  category?: ProductCategory;

  /**
   * product price
   */
  @ApiProperty({
    description: 'product price',
    example: 23,
  })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    description: 'product sort string',
    example: 'newest',
  })
  @IsOptional()
  @IsString()
  @IsIn(['newest', 'oldest', 'most_purchased'])
  sort?: 'newest' | 'oldest' | 'most_purchased';
}

/**
 * dto for get events
 */
export class GetProductsDto extends IntersectionType(
  GetProductsBaseDto,
  PaginationQueryDto,
) {}
