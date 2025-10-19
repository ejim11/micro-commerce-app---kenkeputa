import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../user.entity';
import { Role } from 'src/auth/enums/role-type.enum';
import { NotFoundException } from '@nestjs/common';
import { FindUserByIdProvider } from './find-user-by-id.provider';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('FindUserByIdProvider', () => {
  let findUserByIdProvider: FindUserByIdProvider;

  let usersRepository: MockRepository;

  const user = {
    id: 'lmdnmkwfnwk',
    firstname: 'Ejim',
    lastname: 'favour',
    role: Role.USER,
    email: 'favoure@gmail.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdProvider,
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

    findUserByIdProvider =
      module.get<FindUserByIdProvider>(FindUserByIdProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined!', () => {
    expect(findUserByIdProvider).toBeDefined();
  });

  describe('findUser', () => {
    describe('When the user exists in the DB', () => {
      it('should find the user by email', async () => {
        usersRepository.findOne.mockReturnValue(user);

        await findUserByIdProvider.findUserById(user.id);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: user.id,
          },
        });
      });
    });

    describe('When user does not exist in the DB', () => {
      it('should throw a validation exception', async () => {
        usersRepository.findOne.mockReturnValue(null);

        try {
          await findUserByIdProvider.findUserById(user.id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
