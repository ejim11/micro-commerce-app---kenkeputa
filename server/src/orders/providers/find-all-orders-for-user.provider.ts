import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllOrdersForUserProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async findAllOrders(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders;
  }
}
