import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { User } from '../prisma/generated/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import UserService from './users.service.js';
import { SignupRequestDto } from '../auth/auth.dto.js';

const prismaMock = {
  user: {
    create: jest.fn<() => Promise<User>>(),
  },
};

function createSignUpRequest(
  overrides: Partial<SignupRequestDto> = {},
): SignupRequestDto {
  return {
    email: 'hardik.j0309@gmail.com',
    name: 'Hardik Jain',
    password: 'password',
    ...overrides,
  };
}

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'some-uuid',
    email: 'hardik.j0309@gmail.com',
    name: 'Hardik Jain',
    createdAt: new Date(),
    passwordHash: 'hashed-password',
    ...overrides,
  };
}

describe('UserService', () => {
  let userService: UserService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();
    userService = moduleRef.get(UserService);
  });
  describe('createUser', () => {
    it('should create new user', async () => {
      // Setup
      const signUpRequest = createSignUpRequest();
      const newUserEntity = createUser();
      prismaMock.user.create.mockResolvedValue(newUserEntity);
      // Execute
      const createdUser = await userService.createUser(signUpRequest);
      // Assert
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ...signUpRequest,
            password: undefined,
            passwordHash: expect.any(String),
          }),
        }),
      );
      expect(createdUser).toEqual(newUserEntity);
    });
  });
});
