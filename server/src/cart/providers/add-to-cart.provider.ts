import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from 'src/products/providers/products.service';
import { CreateCartItemDto } from '../dtos/create-cart-item.dto';
import { Cart } from '../interfaces/cart.interface';
import { Repository } from 'typeorm';
import { CartItem } from '../cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCartProvider } from './get-cart.provider';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AddToCartProvider {
  constructor(
    /**
     * injecting the product service
     */
    private readonly productsService: ProductsService,

    /**
     * injecting the users service
     */
    private readonly usersService: UsersService,

    /**
     * injecting the cart item repository
     */
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    /**
     * injecting the get cart provider
     */
    private readonly getCartProvider: GetCartProvider,
  ) {}

  async addToCart(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    const [user, product] = await Promise.all([
      this.usersService.findUserById(userId),
      this.productsService.findProductById(createCartItemDto.productId),
    ]);

    if (product.stock < createCartItemDto.quantity) {
      throw new UnauthorizedException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    // Check if item exists for user
    let cartItem = await this.cartItemRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: createCartItemDto.productId },
      },
    });

    if (cartItem) {
      cartItem.quantity += createCartItemDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        user,
        product,
        quantity: createCartItemDto.quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);

    return await this.getCartProvider.getCart(user.id);
  }
}
