import { Injectable } from '@nestjs/common';
import { CreateOrderProvider } from './create-order.provider';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { FindAllOrdersForUserProvider } from './find-all-orders-for-user.provider';
import { FindOrderByIdProvider } from './find-order-by-id.provider';

@Injectable()
export class OrdersService {
  constructor(
    /**
     * createOrder provider
     */
    private readonly createOrderProvider: CreateOrderProvider,

    private readonly findAllOrdersForUserProvider: FindAllOrdersForUserProvider,

    private readonly findOrderByIdProvider: FindOrderByIdProvider,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    return await this.createOrderProvider.createOrder(userId, createOrderDto);
  }

  async findAllOrders(userId: string) {
    return await this.findAllOrdersForUserProvider.findAllOrders(userId);
  }

  async findOrderById(userId: string, orderId: string) {
    return await this.findOrderByIdProvider.findOrderById(userId, orderId);
  }
}
