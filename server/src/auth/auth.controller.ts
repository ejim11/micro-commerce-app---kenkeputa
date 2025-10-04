import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { SignInDto } from './dtos/sign-in.dto';
import { Role } from './enums/role-type.enum';

/**
 * Controller handling authentication-related operations such as sign-in
 *
 * This controller provides endpoints for user authentication flows, including login, forgot password, reset password, and email verification.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    /**
     * injecting the auth service
     */
    private readonly authService: AuthService,
  ) {}

  /**
   * Signs in a user with valid email and password.
   *
   * This endpoint authenticates the user and returns access and refresh tokens upon successful validation.
   *
   * @param signInDto - The sign-in credentials (email and password).
   * @returns An object containing the access token and refresh token.
   */
  @Post('/sign-in')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in a user with email and password',
    description: 'Authenticates a user and returns access and refresh tokens.',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Sign-in credentials',
    required: true,
    type: SignInDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    schema: {
      type: 'object',
      properties: {
        apiVersion: { type: 'string', example: '1.0.0' },
        data: {
          type: 'object',
          example: {
            accessToken: {
              type: 'string',
              description: 'JWT access token for authenticated requests',
              example: 'jsbfiwhvfquobdfj',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token for token renewal',
              example: 'jsbfiwhvfquobdfj',
            },
            user: {
              type: 'object',
              description: 'user details',
              example: {
                firstname: 'favour',
                lastname: 'ejim',
                email: 'favour@gmail.com',
                role: Role.USER,
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials or missing fields',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid email or password' },
      },
    },
  })
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
