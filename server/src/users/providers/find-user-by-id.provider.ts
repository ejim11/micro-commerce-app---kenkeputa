import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserByIdProvider {
  constructor(
    /**
     * injecting the users repository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException(`user not found!`);

    return user;
  }
}
