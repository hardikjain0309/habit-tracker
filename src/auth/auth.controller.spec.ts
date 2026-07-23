import { jest } from '@jest/globals';
import UserService from '../users/users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import AuthService from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { User } from '../prisma/generated/client.js';
import { SignupRequestDto } from './auth.dto.js';

const userServiceMock = {
  createUser: jest.fn<() => Promise<User>>(),
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

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
      controllers: [AuthController],
    }).compile();
    authController = moduleRef.get(AuthController);
    userService = moduleRef.get(UserService);
  });

  describe('Sign Up API', () => {
    it('should create a new user', async () => {
      // Setup
      const signUpRequest = createSignUpRequest();
      const newUserEntity = createUser();
      userServiceMock.createUser.mockResolvedValue(newUserEntity);
      jest.spyOn(userService, 'createUser');
      // Execute
      const signUpResponse = await authController.signup(signUpRequest);
      // Assert
      expect(userServiceMock.createUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(signUpRequest);
      expect(signUpResponse.email).toBe(newUserEntity.email);
      expect(signUpResponse.name).toBe(newUserEntity.name);
      expect(signUpResponse.id).toBe(newUserEntity.id);
      expect(signUpResponse.createdAt).toBe(newUserEntity.createdAt);
      expect(signUpResponse.passwordHash).toBeUndefined();
    });
  });
});
