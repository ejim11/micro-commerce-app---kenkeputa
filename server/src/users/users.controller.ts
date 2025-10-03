import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from './user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UsersService } from './providers/users.service';
import { Role } from 'src/auth/enums/role-type.enum';
import { CreateUserDto } from './dtos/create-user.dto';

/**
 * Controller handling user-related operations
 * Base URL: /users
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    /**
     * Injecting the users service for user-related operations
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new user account with the provided user details
   *
   * @param createUserDto - The user registration data including firstName, lastName, email and password
   * @returns Promise<User> - The created user object (password excluded from response)
   */
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Register a new user with personal details and credentials. Password will be securely hashed.',
  })
  @ApiBody({
    description: 'User registration details',
    required: true,
    type: CreateUserDto,
    examples: {
      validUser: {
        summary: 'Valid user registration',
        value: {
          firstname: 'Kelechi',
          lastname: 'Agnes',
          email: 'iloghaluagneskc@gmail.com',
          password: '@Password1',
        },
      },
      invalidUser: {
        summary: 'Invalid registration - missing password',
        value: {
          firstname: 'Kelechi',
          lastname: 'Agnes',
          email: 'iloghaluagneskc@gmail.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'User account created successfully. Returns user details without password.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        role: { type: 'string', example: Role.USER },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: `user with {email} already exists`,
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AuthType.None)
  public createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    return this.usersService.createUser(createUserDto);
  }
}
