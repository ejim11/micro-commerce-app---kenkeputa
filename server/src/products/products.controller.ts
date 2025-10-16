import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role-type.enum';
import { Product } from './product.entity';
import { GetProductsDto } from './dtos/get-products.dto';
import { Paginated } from '../common/pagination/interfaces/paginated.interface';
import { UpdateProductDto } from './dtos/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(
    /**
     * injecting the productsService
     */
    private readonly productsService: ProductsService,
  ) {}

  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Creates a new product. Only accessible by admin users. Requires a valid JWT token.',
  })
  @ApiBody({
    description: 'Product creation data',
    required: true,
    type: CreateProductDto,
    examples: {
      validUser: {
        summary: 'valid user response',
        value: {
          name: 'Dark Silver Cutlery Set',
          category: 'Utensils',
          description:
            'Sustainable fork, knife, spoon set – zero plastic waste.',
          price: 25.0,
          stock: 20,
          imageUrl: 'https://m.media-amazon.com/images/I/71ovT+ReiYL.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
    example: {
      id: 'c53808b8-fb98-4c26-abbe-c07c263f161c',
      name: 'Dark Silver Cutlery Set',
      category: 'Utensils',
      description: 'Sustainable fork, knife, spoon set – zero plastic waste.',
      price: 25,
      stock: 20,
      imageUrl: 'https://m.media-amazon.com/images/I/71ovT+ReiYL.jpg',
      createdAt: '2025-10-16T09:13:11.702Z',
      updatedAt: '2025-10-16T09:13:11.702Z',
      deletedAt: null,
      isDeleted: false,
      purchaseCount: 0,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid product data',
    example: {
      apiVersion: '1.0.0',
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'price must be a positive number',
        'stock must be a positive integer',
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
    },
  })
  @Post('')
  @Roles(Role.ADMIN)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a paginated list of all products with optional filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: '727d2e00-7237-4b58-bd28-f3b7eaedb2b3',
                  },
                  name: { type: 'string', example: 'Gold Cutlery Set' },
                  category: { type: 'string', example: 'Utensils' },
                  description: {
                    type: 'string',
                    example:
                      'Sustainable fork, knife, spoon set – zero plastic waste.',
                  },
                  price: { type: 'string', example: '60.00' },
                  stock: { type: 'number', example: 10 },
                  imageUrl: {
                    type: 'string',
                    example: 'https://example.com/image.jpg',
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  isDeleted: { type: 'boolean', example: false },
                  deletedAt: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                  },
                  purchaseCount: { type: 'number', example: 0 },
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                itemsPerPage: { type: 'number', example: 10 },
                totalItems: { type: 'number', example: 40 },
                currentPage: { type: 'number', example: 1 },
                totalPages: { type: 'number', example: 4 },
              },
            },
            links: {
              type: 'object',
              properties: {
                first: {
                  type: 'string',
                  example:
                    'http://localhost:3001/api/v1/products?limit=10&page=1',
                },
                last: {
                  type: 'string',
                  example:
                    'http://localhost:3001/api/v1/products?limit=10&page=4',
                },
                current: {
                  type: 'string',
                  example:
                    'http://localhost:3001/api/v1/products?limit=10&page=1',
                },
                next: {
                  type: 'string',
                  example:
                    'http://localhost:3001/api/v1/products?limit=10&page=2',
                },
                previous: {
                  type: 'string',
                  example:
                    'http://localhost:3001/api/v1/products?limit=10&page=1',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
    example: 'Utensils',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search products by name or description',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field',
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @Auth(AuthType.None)
  @Get('')
  findAllProducts(
    @Query() productsQuery: GetProductsDto,
  ): Promise<Paginated<Product>> {
    return this.productsService.findAllProducts(productsQuery);
  }

  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Update a product',
    description:
      'Updates product details by ID. Only accessible by admin users. Supports partial updates.',
  })
  @ApiParam({
    name: 'productid',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the product to update',
    example: 'a48ac60f-b091-4ac5-9685-fe9aec69d2b3',
  })
  @ApiBody({
    description: 'Product update data (all fields are optional)',
    type: UpdateProductDto,
    examples: {
      updateStock: {
        value: {
          stock: 50,
        },
        description: 'Update only stock quantity',
      },
      updatePrice: {
        value: {
          price: 12.99,
        },
        description: 'Update only price',
      },
      updateAll: {
        value: {
          name: 'Silicone Muffin Cups',
          category: 'Baking',
          description: 'Food-grade silicone baking cups...',
          price: 9.99,
          stock: 50,
          imageUrl:
            'https://images-na.ssl-images-amazon.com/images/I/61VGTeKVpqL.jpg',
        },
        description: 'Update multiple fields',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
    example: {
      id: 'a48ac60f-b091-4ac5-9685-fe9aec69d2b3',
      name: 'Silicone Muffin Cups',
      category: 'Baking',
      description:
        'Food-grade silicone baking cups that are oven-safe up to 450°F...',
      price: '9.00',
      stock: 50,
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/61VGTeKVpqL.jpg',
      createdAt: '2025-10-15T04:32:09.837Z',
      updatedAt: '2025-10-16T09:35:37.131Z',
      isDeleted: false,
      deletedAt: null,
      purchaseCount: 0,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid product data',
    example: {
      apiVersion: '1.0.0',
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'price must be a positive number',
        'stock must be a positive integer',
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
    },
  })
  @Roles(Role.ADMIN)
  @Patch(':productid')
  updateProduct(
    @Param('productid') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(updateProductDto, productId);
  }

  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Delete a product',
    description:
      'Soft deletes a product by ID. The product data is retained in the database but marked as deleted. Only accessible by admin users.',
  })
  @ApiParam({
    name: 'productid',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the product to delete',
    example: 'a48ac60f-b091-4ac5-9685-fe9aec69d2b3',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    example: {
      apiVersion: '1.0.0',
      statusCode: 200,
      data: {
        message: 'Product deleted successfully.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
    },
  })
  @Roles(Role.ADMIN)
  @Delete(':productid')
  // @HttpCode(204)
  deleteProduct(@Param('productid') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
