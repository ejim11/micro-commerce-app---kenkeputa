import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductProvider {
  constructor(
    /**
     * injecting the products repository
     */
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  public async updateProduct(
    updateProductDto: UpdateProductDto,
    productId: string,
  ): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id: productId });

    console.log(product);

    if (!product) throw new NotFoundException('Product not found');

    const filteredPayload = this.filterObj(
      updateProductDto,
      'description',
      'price',
      'stock',
      'isDeleted',
      'deletedAt',
    );

    return await this.productsRepository.save({
      ...product,
      ...filteredPayload,
    });
  }

  private filterObj<T extends Record<string, any>>(
    obj: T,
    ...allowedFields: (keyof T)[]
  ) {
    const newObj = {} as Record<string, any>;
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  }
}
