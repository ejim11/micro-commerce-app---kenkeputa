import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { OrderItem } from '../order-item.entity';
import { Order } from '../order.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { CartService } from 'src/cart/providers/cart.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CartItem } from 'src/cart/cart-item.entity';

@Injectable()
export class CreateOrderProvider {
  constructor(
    private readonly dataSource: DataSource, // For transactions
    private readonly cartService: CartService,
  ) {}
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Could not connect to datasource');
    }

    try {
      await this.cartService.validateCartStock(userId);

      const user = await queryRunner.manager.getRepository(User).findOne({
        where: { id: userId },
      });

      // Fixed: Use CartItem entity and Query Builder
      const cartItemsRaw = await queryRunner.manager
        .createQueryBuilder(CartItem, 'ci')
        .innerJoinAndSelect('ci.product', 'p')
        .where('ci.user.id = :userId', { userId })
        .andWhere('ci.deletedAt IS NULL')
        .setLock('pessimistic_write')
        .getMany();

      // Transform to the format you need
      const cartItems = cartItemsRaw.map((ci) => ({
        id: ci.id,
        quantity: ci.quantity,
        productId: ci.product.id,
        stock: ci.product.stock,
        price: ci.product.price,
      }));

      if (cartItems.length === 0) {
        throw new ConflictException('Cart is empty');
      }

      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          throw new ConflictException(
            `Out of stock for product ${item.productId} (available: ${item.stock})`,
          );
        }
      }
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const total = subtotal;

      const order = queryRunner.manager.create(Order, {
        user,
        total,
        ...createOrderDto,
      });
      await queryRunner.manager.getRepository(Order).save(order);

      const orderItems = cartItems.map((item) =>
        queryRunner.manager.getRepository(OrderItem).create({
          order,
          product: { id: item.productId },
          quantity: item.quantity,
          price: item.price,
        }),
      );
      await queryRunner.manager.getRepository(OrderItem).save(orderItems);

      for (const item of cartItems) {
        await queryRunner.manager.getRepository(Product).update(
          { id: item.productId },
          {
            stock: () => `stock - ${item.quantity}`,
            purchaseCount: () => `"purchaseCount" + ${item.quantity}`,
          },
        );
      }

      await queryRunner.manager.softDelete(CartItem, { user: { id: userId } });

      await queryRunner.commitTransaction(); // Don't forget to commit!
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }
  }
}
