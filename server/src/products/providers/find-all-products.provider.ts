import { Injectable } from '@nestjs/common';
import { GetProductsDto } from '../dtos/get-products.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { Product } from '../product.entity';
import { Between, FindOptionsOrder, ILike, In, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class FindAllProductsProvider {
  constructor(
    /**
     * injecting the products repository
     */
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    /**
     * injecting the pagination provider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  async findAllProducts(
    productQuery: GetProductsDto,
  ): Promise<Paginated<Product>> {
    const cleanedQuery = this.cleanQuery(productQuery);

    const { limit, page, sort } = cleanedQuery;

    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
    const safePage = Number(page) > 0 ? Number(page) : 1;

    const where: any = {
      isDeleted: false,
    };

    if (cleanedQuery.category) {
      where.category = In(cleanedQuery.category.split(','));
    }
    if (cleanedQuery.price) {
      const [min, max] = cleanedQuery.price
        .split('-')
        .map((p) => parseFloat(p.trim()));

      if (!isNaN(min) && !isNaN(max)) {
        where.price = Between(min, max);
      }
    }
    if (cleanedQuery.name) {
      const searchTerm = cleanedQuery.name.split('-').join(' '); // Replace dashes with spaces
      where.name = ILike(`%${searchTerm}%`);
    }

    // Build order conditions (default to newest)
    const order: FindOptionsOrder<Product> = { createdAt: 'DESC' };
    if (sort) {
      switch (sort) {
        case 'newest':
          order.createdAt = 'DESC';
          break;
        case 'oldest':
          order.createdAt = 'ASC';
          break;
        case 'most_purchased':
          order.purchaseCount = 'DESC';
          break;

        default:
          // Fallback if validation misses
          order.createdAt = 'DESC';
      }
    }

    // Use PaginationProvider with options
    const paginationQuery: PaginationQueryDto = {
      limit: safeLimit,
      page: safePage,
    };

    const paginatedProducts =
      await this.paginationProvider.paginationQuery<Product>(
        paginationQuery,
        this.productsRepository,
        {
          where,
          order,
        },
      );

    return paginatedProducts;
  }

  private cleanQuery(query: GetProductsDto): GetProductsDto {
    return Object.fromEntries(
      Object.entries(query).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) =>
          value !== 'undefined' && value !== undefined && value !== '',
      ),
    ) as GetProductsDto;
  }
}
