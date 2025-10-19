import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../user.entity';
import { Role } from 'src/auth/enums/role-type.enum';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('FindUserByEmailProvider', () => {
  let findUserByEmailProvider: FindUserByEmailProvider;

  let usersRepository: MockRepository;

  const user = {
    firstname: 'Ejim',
    lastname: 'favour',
    role: Role.USER,
    email: 'favoure@gmail.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailProvider,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
      ],
    }).compile();

    findUserByEmailProvider = module.get<FindUserByEmailProvider>(
      FindUserByEmailProvider,
    );
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined!', () => {
    expect(findUserByEmailProvider).toBeDefined();
  });

  describe('findUser', () => {
    describe('When the user exists in the DB', () => {
      it('should find the user by email', async () => {
        usersRepository.findOne.mockReturnValue(user);

        await findUserByEmailProvider.findUserByEmail(user.email);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: user.email,
          },
          select: ['id', 'password', 'email', 'role', 'firstname', 'lastname'],
        });
      });
    });

    describe('When user does not exist in the DB', () => {
      it('should throw a validation exception', async () => {
        usersRepository.findOne.mockReturnValue(null);

        try {
          await findUserByEmailProvider.findUserByEmail(user.email);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
