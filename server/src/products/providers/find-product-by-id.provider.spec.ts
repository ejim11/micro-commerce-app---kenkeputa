import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ProductCategory } from '../enums/product-category.enum';
import { FindProductByIdProvider } from './find-product-by-id.provider';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('FindProductByIdProvider', () => {
  let findProductByIdProvider: FindProductByIdProvider;

  let productRepository: MockRepository;

  const product = {
    id: 'jnfkdmllskfkmd',
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
        FindProductByIdProvider,
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

    findProductByIdProvider = module.get<FindProductByIdProvider>(
      FindProductByIdProvider,
    );
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined!', () => {
    expect(findProductByIdProvider).toBeDefined();
  });

  describe('findProduct', () => {
    describe('When the product exists in the DB', () => {
      it('should find the product', async () => {
        productRepository.findOne.mockReturnValue(product);

        await findProductByIdProvider.findProductById(product.id);
        expect(productRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: product.id,
          },
        });
      });
    });

    describe('When product does not exist in the DB', () => {
      it('should throw a bad request exception', async () => {
        productRepository.findOne.mockReturnValue(null);

        try {
          await findProductByIdProvider.findProductById(product.id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
