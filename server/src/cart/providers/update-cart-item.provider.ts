import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartItem } from '../cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../interfaces/cart.interface';
import { GetCartProvider } from './get-cart.provider';
import { Product } from 'src/products/product.entity';

@Injectable()
export class UpdateCartItemProvider {
  constructor(
    /**
     * injecting the cartRepository
     */
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    /**
     * injecting the get cart provider
     */
    private readonly getCartProvider: GetCartProvider,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async decrementQuantity(userId: string, productId: string): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not in cart');
    }

    if (cartItem.quantity <= 1) {
      // Optionally remove if reaches 0, or just set to 1
      return this.removeFromCart(userId, productId);
    }

    cartItem.quantity -= 1; // Subtract 1
    await this.cartItemRepository.save(cartItem);
    return this.getCartProvider.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not in cart');
    }

    await this.cartItemRepository.softDelete({ id: cartItem.id });
    return this.getCartProvider.getCart(userId);
  }

  // For orders: Validate stock before checkout
  async validateCartStock(userId: string): Promise<void> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId }, deletedAt: null },
      relations: ['product'],
    });

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new UnauthorizedException(
          `Out of stock for ${item.product.name}`,
        );
      }
    }
  }

  // Deduct stock after order (call in OrdersService)
  async deductStock(userId: string): Promise<void> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId }, deletedAt: null },
      relations: ['product'],
    });

    for (const item of cartItems) {
      item.product.stock -= item.quantity;
      await this.productRepository.save(item.product);
    }
  }

  // Clear cart after order
  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.update(
      { user: { id: userId } },
      {
        deletedAt: new Date(),
      },
    );
  }
}
