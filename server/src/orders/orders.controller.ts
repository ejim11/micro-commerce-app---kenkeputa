import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './providers/orders.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    /**
     * injecting the orders service
     */
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async createOrder(
    @ActiveUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  async getOrders(@ActiveUser('sub') userId: string) {
    return this.ordersService.findAllOrders(userId);
  }

  @Get(':id')
  async getOrder(
    @ActiveUser('sub') userId: string,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.findOrderById(userId, orderId);
  }
}
