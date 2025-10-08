// src/cart/entities/cart-item.entity.ts
// User-based cart item entity: Persists cart per user in DB
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // Soft delete for cart items
}
