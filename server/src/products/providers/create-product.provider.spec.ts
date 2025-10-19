import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductProvider } from './create-product.provider';
import { Product } from '../product.entity';
import { ProductCategory } from '../enums/product-category.enum';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateProductProvider', () => {
  let createProductProvider: CreateProductProvider;

  let productRepository: MockRepository;

  const product = {
    name: 'Gold Cutlery Set',
    category: ProductCategory.UTENSILS,
    description: 'Sustainable fork, knife, spoon set – zero plastic waste.',
    price: 60,
    stock: 7,
    imageUrl:
      'https://i.etsystatic.com/32686477/r/il/e0f872/3490856605/il_600x600.3490856605_a1lf.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductProvider,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    createProductProvider = module.get<CreateProductProvider>(
      CreateProductProvider,
    );
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined!', () => {
    expect(createProductProvider).toBeDefined();
  });

  describe('createProduct', () => {
    describe('When the product does not exist in the DB', () => {
      it('should create the new product', async () => {
        const newProduct = {
          id: 'kndkmdlmd',
          ...product,
        };
        productRepository.create.mockReturnValue(newProduct);
        productRepository.save.mockReturnValue(newProduct);

        await createProductProvider.createProduct(product);

        expect(productRepository.create).toHaveBeenCalledWith(
          expect.objectContaining(product),
        );

        expect(productRepository.save).toHaveBeenCalledWith(newProduct);
      });
    });

    describe('When product with same name already exist', () => {
      it('should throw a bad request exception', async () => {
        productRepository.create.mockReturnValue(
          expect.objectContaining({
            id: 'kndkmdlmd',
            ...product,
          }),
        );
        productRepository.save.mockReturnValue({
          id: 'kndkmdlmd',
          ...product,
        });

        try {
          await createProductProvider.createProduct(product);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
