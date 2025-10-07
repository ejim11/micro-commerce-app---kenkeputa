import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartItem } from './cart-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './providers/cart.service';
import { AddToCartProvider } from './providers/add-to-cart.provider';
import { GetCartProvider } from './providers/get-cart.provider';
import { UsersModule } from 'src/users/users.module';
import { UpdateCartItemProvider } from './providers/update-cart-item.provider';
import { Product } from 'src/products/product.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    Product,
    UsersModule,
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [
    CartService,
    AddToCartProvider,
    GetCartProvider,
    UpdateCartItemProvider,
  ],
  exports: [CartService],
})
export class CartModule {}
