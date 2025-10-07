import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from './enums/product-category.enum';
import { CartItem } from 'src/cart/cart-item.entity';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/orders/order-item.entity';

@Entity('products')
@Index(['name'])
@Index(['category'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ length: 50, nullable: false, enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ default: 0, nullable: false })
  stock: number;

  @Column({ length: 255, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @Column({
    default: 0,
  })
  purchaseCount: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems?: CartItem[];

  @OneToMany(() => OrderItem, (order) => order.product)
  orders: Order[];
}
