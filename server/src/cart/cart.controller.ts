import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(
    /**
     * injecting the cartService
     */
    private readonly cartService: CartService,
  ) {}

  @Post('')
  addToCart(@ActiveUser('sub') userId: string, @Body() dto: CreateCartItemDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get('')
  getUserCart(@ActiveUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete(':productId')
  async removeFromCart(
    @ActiveUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeCartItem(userId, productId);
  }

  @Patch(':productId')
  async decrementQuantity(
    @ActiveUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.decrementQuantity(userId, productId);
  }
}
