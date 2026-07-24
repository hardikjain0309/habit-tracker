import { jest } from '@jest/globals';
import UserService from '../users/users.service.js';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import AuthService from './auth.service.js';
import { User } from '../prisma/generated/client.js';
import {
  SignupRequestDto,
  TokenRequestDto,
  TokenResponseDto,
} from './auth.dto.js';

const userServiceMock = {
  createUser: jest.fn<() => Promise<User>>(),
};

const authServiceMock = {
  generateToken: jest.fn<() => Promise<TokenResponseDto>>(),
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

function createPasswordGrantTokenRequest(): Partial<TokenRequestDto> {
  return {
    grantType: 'password',
    email: 'hardik.j0309@gmail.com',
    password: 'password',
  };
}

function createTokenPairResponse(): TokenResponseDto {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: 123,
  };
}

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
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

  describe('Generate Auth Token API', () => {
    it('should accept user creds to generate tokens', async () => {
      // Setup
      const passwordGrantRequest = createPasswordGrantTokenRequest();
      const mockTokenResponse: TokenResponseDto = createTokenPairResponse();
      authServiceMock.generateToken.mockResolvedValue(mockTokenResponse);
      // Execute
      const response = await authController.login(
        passwordGrantRequest as TokenRequestDto,
      );
      // Assert
      expect(response).toEqual(mockTokenResponse);
    });
  });
});
