import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteProductProvider {
  constructor(
    /**
     * injecting the products repository
     */
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  public async deleteProduct(productId: string): Promise<{ message: string }> {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) throw new NotFoundException('Product not found');

    await this.productsRepository.save({
      ...product,
      isDeleted: true,
      deletedAt: new Date(),
    });

    return {
      message: 'Product deleted successfully.',
    };
  }
}
