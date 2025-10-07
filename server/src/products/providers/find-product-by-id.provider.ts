import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindProductByIdProvider {
  constructor(
    /**
     * injecting the products repository
     */
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  public async findProductById(productId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found!');

    return product;
  }
}
