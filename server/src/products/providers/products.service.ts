import { Injectable } from '@nestjs/common';
import { CreateProductProvider } from './create-product.provider';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../product.entity';
import { FindAllProductsProvider } from './find-all-products.provider';
import { GetProductsDto } from '../dtos/get-products.dto';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { UpdateProductProvider } from './update-product.provider';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { DeleteProductProvider } from './delete-product.provider';
import { FindProductByIdProvider } from './find-product-by-id.provider';

@Injectable()
export class ProductsService {
  constructor(
    /**
     * injecting the create product provider
     */
    private readonly createProductProvider: CreateProductProvider,

    /**
     * injecting the find all products provider
     */
    private readonly findAllProductsProvider: FindAllProductsProvider,

    /**
     * injecting the update product provider
     */
    private readonly updateProductProvider: UpdateProductProvider,

    /**
     * injecting the deleteProductProvider
     */
    private readonly deleteProductProvider: DeleteProductProvider,

    /**
     * injecting the findProductByIdProvider
     */
    private readonly findProductByIdProvider: FindProductByIdProvider,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.createProductProvider.createProduct(createProductDto);
  }

  async findAllProducts(
    productQuery: GetProductsDto,
  ): Promise<Paginated<Product>> {
    return this.findAllProductsProvider.findAllProducts(productQuery);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    productId: string,
  ): Promise<Product> {
    return await this.updateProductProvider.updateProduct(
      updateProductDto,
      productId,
    );
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    return await this.deleteProductProvider.deleteProduct(productId);
  }

  async findProductById(productId: string): Promise<Product> {
    return await this.findProductByIdProvider.findProductById(productId);
  }
}
