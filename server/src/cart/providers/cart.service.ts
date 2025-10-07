import { Injectable } from '@nestjs/common';
import { AddToCartProvider } from './add-to-cart.provider';
import { CreateCartItemDto } from '../dtos/create-cart-item.dto';
import { GetCartProvider } from './get-cart.provider';
import { UpdateCartItemProvider } from './update-cart-item.provider';

@Injectable()
export class CartService {
  constructor(
    /**
     * injecting the addToCartProvider
     */
    private readonly addToCartProvider: AddToCartProvider,

    /**
     * injecting the getCartProvider
     */
    private readonly getCartProvider: GetCartProvider,

    /**
     * injecting the update
     */
    private readonly updateCartItemProvider: UpdateCartItemProvider,
  ) {}

  async addToCart(userId: string, createCartItemDto: CreateCartItemDto) {
    return await this.addToCartProvider.addToCart(userId, createCartItemDto);
  }

  async getCart(userId: string) {
    return await this.getCartProvider.getCart(userId);
  }

  async removeCartItem(userId: string, productId: string) {
    return await this.updateCartItemProvider.removeFromCart(userId, productId);
  }

  async decrementQuantity(userId: string, productId: string) {
    return await this.updateCartItemProvider.decrementQuantity(
      userId,
      productId,
    );
  }

  async validateCartStock(userId: string) {
    return await this.updateCartItemProvider.validateCartStock(userId);
  }

  async clearCart(userId: string) {
    console.log('Clearing cart for user:', userId);
    return await this.updateCartItemProvider.clearCart(userId);
  }
}
