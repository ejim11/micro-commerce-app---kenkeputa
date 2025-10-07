import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role-type.enum';
import { Product } from './product.entity';
import { GetProductsDto } from './dtos/get-products.dto';
import { Paginated } from '../common/pagination/interfaces/paginated.interface';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    /**
     * injecting the productsService
     */
    private readonly productsService: ProductsService,
  ) {}

  @Post('')
  @Roles(Role.ADMIN)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Auth(AuthType.None)
  @Get('')
  findAllProducts(
    @Query() productsQuery: GetProductsDto,
  ): Promise<Paginated<Product>> {
    return this.productsService.findAllProducts(productsQuery);
  }

  @Roles(Role.ADMIN)
  @Patch(':productid')
  updateProduct(
    @Param('productid') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(updateProductDto, productId);
  }

  @Roles(Role.ADMIN)
  @Delete(':productid')
  // @HttpCode(204)
  deleteProduct(@Param('productid') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
