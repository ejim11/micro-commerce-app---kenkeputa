import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(
    /**
     * injecting the cartService
     */
    private readonly cartService: CartService,
  ) {}

  @ApiOperation({
    summary: 'Clear user cart',
    description: "Remove all items from the user's shopping cart",
  })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Cart cleared successfully',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found for the user',
  })
  @Delete('clear')
  clearUserCart(@ActiveUser('sub') userId: string) {
    console.log('clearing...');
    return this.cartService.clearCart(userId);
  }

  @ApiOperation({
    summary: 'Add item to cart',
    description:
      "Add a product to the user's shopping cart or update quantity if item already exists",
  })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 201 },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: 'ca51605b-4f77-45ff-82c4-8d39d19936b0',
                  },
                  product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        format: 'uuid',
                        example: '229f1a79-fd13-453c-9971-8e6db151de12',
                      },
                      name: { type: 'string', example: 'Ceramic Mug Set' },
                      category: { type: 'string', example: 'Drinkware' },
                      description: {
                        type: 'string',
                        example:
                          'Hand-thrown ceramic mugs crafted from recycled clay...',
                      },
                      price: { type: 'string', example: '14.00' },
                      stock: { type: 'number', example: 40 },
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
                  quantity: { type: 'number', example: 8 },
                },
              },
            },
            subtotal: { type: 'number', example: 200 },
            total: { type: 'number', example: 200 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid product ID or quantity',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['productId', 'quantity'],
      properties: {
        productId: {
          type: 'string',
          format: 'uuid',
          example: '229f1a79-fd13-453c-9971-8e6db151de12',
          description: 'UUID of the product to add to cart',
        },
        quantity: {
          type: 'number',
          example: 7,
          minimum: 1,
          description: 'Quantity of the product to add',
        },
      },
    },
  })
  @Post('')
  addToCart(@ActiveUser('sub') userId: string, @Body() dto: CreateCartItemDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @ApiOperation({
    summary: 'Get user cart',
    description:
      "Retrieve the authenticated user's shopping cart with all items, products details, and totals",
  })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: '72b95b06-0f62-4f80-bf5e-b63a192e5ae0',
                  },
                  product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        format: 'uuid',
                        example: '6351f37e-0bc4-44eb-aab8-7eebaca0c563',
                      },
                      name: { type: 'string', example: 'Eco Sponge Set' },
                      category: { type: 'string', example: 'Cleaning' },
                      description: {
                        type: 'string',
                        example:
                          'Plant-based cellulose sponges that are completely biodegradable...',
                      },
                      price: { type: 'string', example: '5.50' },
                      stock: { type: 'number', example: 82 },
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
                      purchaseCount: { type: 'number', example: 8 },
                    },
                  },
                  quantity: { type: 'number', example: 1 },
                },
              },
            },
            subtotal: {
              type: 'number',
              example: 172,
              description:
                'Total price of all items before any discounts or taxes',
            },
            total: {
              type: 'number',
              example: 172,
              description: 'Final total amount for the cart',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found for the user',
  })
  @Get('')
  getUserCart(@ActiveUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @ApiOperation({
    summary: 'Remove item from cart',
    description: "Remove a specific item from the user's shopping cart",
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'cartId',
    type: 'string',
    format: 'uuid',
    description: 'UUID of the cart item to remove',
    example: '52acb271-088a-4609-9953-c874d9bce11d',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item removed successfully. Returns updated cart.',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: 'ca51605b-4f77-45ff-82c4-8d39d19936b0',
                  },
                  product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        format: 'uuid',
                        example: '229f1a79-fd13-453c-9971-8e6db151de12',
                      },
                      name: { type: 'string', example: 'Ceramic Mug Set' },
                      category: { type: 'string', example: 'Drinkware' },
                      description: {
                        type: 'string',
                        example:
                          'Hand-thrown ceramic mugs crafted from recycled clay...',
                      },
                      price: { type: 'string', example: '14.00' },
                      stock: { type: 'number', example: 40 },
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
                  quantity: { type: 'number', example: 6 },
                },
              },
            },
            subtotal: {
              type: 'number',
              example: 151,
              description: 'Updated subtotal after item removal',
            },
            total: {
              type: 'number',
              example: 151,
              description: 'Updated total after item removal',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found or does not belong to user',
  })
  @Delete(':cartId')
  removeFromCart(
    @ActiveUser('sub') userId: string,
    @Param('cartId') cartId: string,
  ) {
    return this.cartService.removeCartItem(userId, cartId);
  }

  @ApiOperation({
    summary: 'Update cart item quantity',
    description: "Update the quantity of a specific item in the user's cart",
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'cartId',
    type: 'string',
    format: 'uuid',
    description: 'UUID of the cart item to update',
    example: 'ca51605b-4f77-45ff-82c4-8d39d19936b0',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item quantity updated successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: 'ca51605b-4f77-45ff-82c4-8d39d19936b0',
                  },
                  product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        format: 'uuid',
                        example: '229f1a79-fd13-453c-9971-8e6db151de12',
                      },
                      name: { type: 'string', example: 'Ceramic Mug Set' },
                      category: { type: 'string', example: 'Drinkware' },
                      description: {
                        type: 'string',
                        example:
                          'Hand-thrown ceramic mugs crafted from recycled clay...',
                      },
                      price: { type: 'string', example: '14.00' },
                      stock: { type: 'number', example: 40 },
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
                  quantity: { type: 'number', example: 2 },
                },
              },
            },
            subtotal: { type: 'number', example: 200 },
            total: { type: 'number', example: 200 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid cart item ID or quantity',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found or does not belong to user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['quantity'],
      properties: {
        quantity: {
          type: 'number',
          example: 2,
          minimum: 1,
          description: 'New quantity for the cart item',
        },
      },
    },
  })
  @Patch(':cartId')
  decrementQuantity(
    @ActiveUser('sub') userId: string,
    @Param('cartId') cartId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    console.log('qty', updateCartItemDto.quantity);
    return this.cartService.decrementQuantity(
      userId,
      cartId,
      updateCartItemDto,
    );
  }
}
