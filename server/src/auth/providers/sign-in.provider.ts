import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/users/user.entity';

/**
 * provider for sigining in users
 */
@Injectable()
export class SignInProvider {
  /**
   * constructor
   * @param usersService
   * @param hashingProvider
   * @param generateTokenProvider
   */
  constructor(
    /**
     * injecting the user service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Injecting the hashing provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * injecting the generate token provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  /**
   * function for signing in users
   * @param signInDto
   * @returns access and refresh tokens
   */
  public async signIn(signInDto: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const user: User = await this.usersService.findUserByEmail(signInDto.email);

    let isPasswordEqual: boolean = false;

    isPasswordEqual = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordEqual) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // generate an access token
    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        email: user.email,
      },
    };
  }
}
