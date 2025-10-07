import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductProvider } from './providers/create-product.provider';
import { FindAllProductsProvider } from './providers/find-all-products.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UpdateProductProvider } from './providers/update-product.provider';
import { DeleteProductProvider } from './providers/delete-product.provider';
import { FindProductByIdProvider } from './providers/find-product-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), PaginationModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CreateProductProvider,
    FindAllProductsProvider,
    UpdateProductProvider,
    DeleteProductProvider,
    FindProductByIdProvider,
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
