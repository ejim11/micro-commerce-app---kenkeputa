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
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(
    /**
     * injecting the cartService
     */
    private readonly cartService: CartService,
  ) {}

  @Delete('clear')
  clearUserCart(@ActiveUser('sub') userId: string) {
    console.log('clearing...');
    return this.cartService.clearCart(userId);
  }

  @Post('')
  addToCart(@ActiveUser('sub') userId: string, @Body() dto: CreateCartItemDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get('')
  getUserCart(@ActiveUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete(':cartId')
  removeFromCart(
    @ActiveUser('sub') userId: string,
    @Param('cartId') cartId: string,
  ) {
    return this.cartService.removeCartItem(userId, cartId);
  }

  @Patch(':cartId')
  decrementQuantity(
    @ActiveUser('sub') userId: string,
    @Param('cartId') cartId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    console.log('qty', updateCartItemDto.quantity);
    return this.cartService.decrementQuantity(
      userId,
      cartId,
      updateCartItemDto,
    );
  }
}
