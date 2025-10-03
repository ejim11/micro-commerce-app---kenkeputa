import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {
  constructor(
    /**
     * injecting the create user provider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * injecting the find user by email provider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  /**
   * service for creating a user
   * @param createUserDto
   * @returns User
   */
  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async findUserByEmail(email: string): Promise<User> {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }
}
