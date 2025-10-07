import { IsIn, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../enums/product-category.enum';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { IntersectionType } from '@nestjs/swagger';

export class GetProductsBaseDto {
  /**
   * product name
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * product category
   */
  @IsString()
  @IsOptional()
  category?: ProductCategory;

  /**
   * product price
   */
  @IsString()
  @IsOptional()
  price?: string;

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
