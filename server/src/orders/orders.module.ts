import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './providers/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderProvider } from './providers/create-order.provider';
import { CartModule } from 'src/cart/cart.module';
import { FindAllOrdersForUserProvider } from './providers/find-all-orders-for-user.provider';
import { FindOrderByIdProvider } from './providers/find-order-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CreateOrderProvider,
    FindAllOrdersForUserProvider,
    FindOrderByIdProvider,
  ],
})
export class OrdersModule {}
