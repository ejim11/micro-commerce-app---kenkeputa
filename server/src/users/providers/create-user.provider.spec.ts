import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../user.entity';
import { ValidationException } from 'src/common/filters/common-exceptions.filter';
import { Role } from 'src/auth/enums/role-type.enum';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('CreateUserProvider', () => {
  let createUserProvider: CreateUserProvider;

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
        CreateUserProvider,
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

    createUserProvider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined!', () => {
    expect(createUserProvider).toBeDefined();
  });

  describe('createUser', () => {
    describe('When the user does not exist in the DB', () => {
      it('should create the new user', async () => {
        usersRepository.findOne.mockReturnValue(null);
        usersRepository.create.mockReturnValue(user);
        usersRepository.save.mockReturnValue(user);

        await createUserProvider.createUser(user);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: user.email,
          },
        });

        expect(usersRepository.create).toHaveBeenCalledWith(
          expect.objectContaining(user),
        );

        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });

    describe('When user already exist', () => {
      it('should throw a validation exception', async () => {
        usersRepository.findOne.mockReturnValue(user.email);
        usersRepository.create.mockReturnValue(expect.objectContaining(user));
        usersRepository.save.mockReturnValue(user);

        try {
          await createUserProvider.createUser(user);
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationException);
        }
      });
    });
  });
});
