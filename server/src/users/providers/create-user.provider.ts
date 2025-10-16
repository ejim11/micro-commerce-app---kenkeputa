import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ValidationException } from 'src/common/filters/common-exceptions.filter';
import { Role } from 'src/auth/enums/role-type.enum';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * injecting the users repository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Injecting hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ValidationException([
        `user with ${createUserDto.email} already exists`,
      ]);
    }

    // create a new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      role: Role.USER,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    newUser = await this.usersRepository.save(newUser);

    return {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }
}
