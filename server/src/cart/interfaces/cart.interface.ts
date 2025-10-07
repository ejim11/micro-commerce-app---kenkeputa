import { Product } from '../../products/product.entity';

export interface Cart {
  items: {
    id: string;
    product: Product;
    quantity: number;
  }[];
  subtotal: number;
  total: number;
}
