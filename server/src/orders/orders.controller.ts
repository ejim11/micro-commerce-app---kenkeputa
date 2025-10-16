import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './providers/orders.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(
    /**
     * injecting the orders service
     */
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOperation({
    summary: 'Create order',
    description:
      "Create a new order from the user's cart items. The cart must not be empty.",
  })
  @ApiBearerAuth('bearer')
  @ApiBody({
    type: CreateOrderDto,
    schema: {
      type: 'object',
      required: ['shippingAddress', 'billingAddress', 'paymentMethod'],
      properties: {
        shippingAddress: {
          type: 'string',
          example: '123 Main St, Cityville',
          description: 'Shipping address for the order',
        },
        billingAddress: {
          type: 'string',
          example: '456 Elm St, Townsville',
          description: 'Billing address for the order',
        },
        paymentMethod: {
          type: 'string',
          example: 'credit_card',
          description: 'Payment method for the order',
          enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 201 },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '0c125a6a-e1c8-45b5-87f2-a1978d6f4de0',
            },
            total: {
              type: 'number',
              example: 11,
              description: 'Total order amount',
            },
            shippingAddress: {
              type: 'string',
              example: '123 Main St, Cityville',
            },
            billingAddress: {
              type: 'string',
              example: '456 Elm St, Townsville',
            },
            paymentMethod: {
              type: 'string',
              example: 'credit_card',
            },
            status: {
              type: 'string',
              example: 'pending',
              description: 'Current order status',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  example: 'b42241bc-6ff9-451c-afb5-2fc77d7b0e01',
                },
                firstname: { type: 'string', example: 'Ejim' },
                lastname: { type: 'string', example: 'Favour' },
                email: { type: 'string', example: 'favour@gmail.com' },
                role: { type: 'string', example: 'user' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Cart is empty or insufficient stock',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/api/v1/orders' },
        method: { type: 'string', example: 'POST' },
        controller: { type: 'string', example: 'OrdersController' },
        handler: { type: 'string', example: 'postOrders' },
        errorType: { type: 'string', example: 'ConflictException' },
        errorCode: { type: 'string', example: 'ERR_CONFLICT' },
        message: {
          type: 'string',
          example: 'Could not complete the transaction',
        },
        details: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Could not complete the transaction',
            },
            error: {
              type: 'string',
              example: 'ConflictException: Cart is empty',
            },
            statusCode: { type: 'number', example: 409 },
          },
        },
      },
    },
  })
  @Post()
  async createOrder(
    @ActiveUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @ApiOperation({
    summary: 'Get user orders',
    description:
      'Retrieve all orders for the authenticated user with order items and product details',
  })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '05e08508-afbf-45b5-8e82-767dc90fb7d3',
              },
              total: {
                type: 'string',
                example: '14.00',
                description: 'Total order amount',
              },
              status: {
                type: 'string',
                example: 'pending',
                description: 'Current order status',
                enum: [
                  'pending',
                  'processing',
                  'shipped',
                  'delivered',
                  'cancelled',
                ],
              },
              shippingAddress: {
                type: 'string',
                example: '33 Main St, Cityville',
              },
              billingAddress: {
                type: 'string',
                example: '12 Elm St, Townsville',
              },
              paymentMethod: {
                type: 'string',
                example: 'credit_card',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-16T17:20:05.293Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-16T17:20:05.293Z',
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      example: '736a1968-b6e7-49dc-be55-faa187539155',
                    },
                    quantity: {
                      type: 'number',
                      example: 1,
                      description: 'Quantity of the product in this order',
                    },
                    price: {
                      type: 'string',
                      example: '14.00',
                      description: 'Price of the product at time of order',
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
                        price: {
                          type: 'string',
                          example: '14.00',
                          description: 'Current price of the product',
                        },
                        stock: { type: 'number', example: 39 },
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
                        purchaseCount: {
                          type: 'number',
                          example: 1,
                          description:
                            'Total number of times this product has been purchased',
                        },
                      },
                    },
                  },
                },
              },
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
    description: 'No orders found for the user',
  })
  @Get()
  async getOrders(@ActiveUser('sub') userId: string) {
    return this.ordersService.findAllOrders(userId);
  }

  @ApiOperation({
    summary: 'Get order by ID',
    description:
      'Retrieve a specific order by its ID with all order items and product details. User can only access their own orders.',
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID of the order to retrieve',
    example: '05e08508-afbf-45b5-8e82-767dc90fb7d3',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '05e08508-afbf-45b5-8e82-767dc90fb7d3',
            },
            total: {
              type: 'string',
              example: '14.00',
              description: 'Total order amount',
            },
            status: {
              type: 'string',
              example: 'pending',
              description: 'Current order status',
              enum: [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
              ],
            },
            shippingAddress: {
              type: 'string',
              example: '33 Main St, Cityville',
            },
            billingAddress: {
              type: 'string',
              example: '12 Elm St, Townsville',
            },
            paymentMethod: {
              type: 'string',
              example: 'credit_card',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-16T17:20:05.293Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-16T17:20:05.293Z',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                    example: '736a1968-b6e7-49dc-be55-faa187539155',
                  },
                  quantity: {
                    type: 'number',
                    example: 1,
                    description: 'Quantity of the product in this order',
                  },
                  price: {
                    type: 'string',
                    example: '14.00',
                    description: 'Price of the product at time of order',
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
                      price: {
                        type: 'string',
                        example: '14.00',
                        description: 'Current price of the product',
                      },
                      stock: { type: 'number', example: 39 },
                      imageUrl: {
                        type: 'string',
                        example:
                          'https://m.media-amazon.com/images/I/61a2v30mxOL.jpg',
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                      isDeleted: { type: 'boolean', example: false },
                      deletedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                      },
                      purchaseCount: { type: 'number', example: 1 },
                    },
                  },
                },
              },
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
    status: 403,
    description: 'Forbidden - Order does not belong to user',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @Get(':id')
  async getOrder(
    @ActiveUser('sub') userId: string,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.findOrderById(userId, orderId);
  }
}
