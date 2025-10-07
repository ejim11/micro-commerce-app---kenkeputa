import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class CreateProductProvider {
  constructor(
    /**
     * injecting the product repository
     */
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
    });

    return await this.productsRepository.save(newProduct);
  }
}
