import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { SignInDto } from '../dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * injecting the sign in provider
     */
    private readonly signInProvider: SignInProvider,
  ) {}

  /**
   * function for signing in a user
   * @param signInDto
   * @returns access and refresh tokens
   */
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
}
