import { Injectable } from '@nestjs/common';
import { Cart } from '../interfaces/cart.interface';
import { Repository } from 'typeorm';
import { CartItem } from '../cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetCartProvider {
  constructor(
    /**
     * injecting the cart item repository
     */
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId }, deletedAt: null },
      relations: ['product'],
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }));

    const subtotal = await this.calculateSubtotal(items);
    return {
      items,
      subtotal,
      total: subtotal,
    };
  }

  private async calculateSubtotal(items: Cart['items']): Promise<number> {
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.product.price * item.quantity;
    }
    return Number(subtotal.toFixed(2));
  }
}
