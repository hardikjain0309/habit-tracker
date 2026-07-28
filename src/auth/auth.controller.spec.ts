import { jest } from '@jest/globals';
import UserService from '../users/users.service.js';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import AuthService from './auth.service.js';
import {
  buildPasswordGrantTokenRequest,
  buildRefreshTokenRequest,
  buildTokenPairResponse,
} from '../../test/factories/auth.factory.js';
import { InternalServerErrorException } from '@nestjs/common';
import { createUserServiceMock } from '../../test/mocks/user-service.mock.js';
import { createAuthServiceMock } from '../../test/mocks/auth-service.mock.js';
import {
  buildSignUpRequest,
  buildUser,
} from '../../test/factories/user.factory.js';
import { TokenResponseDto } from './auth.dto.js';

describe('AuthController', () => {
  let authController: AuthController;
  let userServiceMock: ReturnType<typeof createUserServiceMock>;
  let authServiceMock: ReturnType<typeof createAuthServiceMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    userServiceMock = createUserServiceMock();
    authServiceMock = createAuthServiceMock();
    const module = await Test.createTestingModule({
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
    authController = module.get(AuthController);
  });

  describe('Sign Up API', () => {
    it('should create a new user', async () => {
      // Arrange
      const signUpRequest = buildSignUpRequest();
      const newUserEntity = buildUser();
      userServiceMock.createUser.mockResolvedValue(newUserEntity);
      // Act
      const signUpResponse = await authController.signup(signUpRequest);
      // Assert
      expect(userServiceMock.createUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(signUpRequest);
      expect(signUpResponse).toEqual({
        email: newUserEntity.email,
        name: newUserEntity.name,
        id: newUserEntity.id,
        createdAt: newUserEntity.createdAt,
      });
      expect(signUpResponse).not.toHaveProperty('passwordHash');
    });

    it('should pass through exception thrown by user service', async () => {
      // Arrange
      const signUpRequest = buildSignUpRequest();
      const mockHttpException = new InternalServerErrorException('Some error');
      userServiceMock.createUser.mockRejectedValue(mockHttpException);
      // Act
      await expect(authController.signup(signUpRequest)).rejects.toThrow(
        mockHttpException,
      );
      // Assert
      expect(userServiceMock.createUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(signUpRequest);
    });
  });

  describe('Generate Auth Token API', () => {
    it('should accept user creds to generate tokens', async () => {
      // Arrange
      const passwordGrantRequest = buildPasswordGrantTokenRequest();
      const mockTokenResponse: TokenResponseDto = buildTokenPairResponse();
      authServiceMock.generateToken.mockResolvedValue(mockTokenResponse);
      // Act
      const response = await authController.login(passwordGrantRequest);
      // Assert
      expect(response).toBe(mockTokenResponse);
      expect(authServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(authServiceMock.generateToken).toHaveBeenCalledWith(
        passwordGrantRequest,
      );
    });

    it('should accept refresh token to generate tokens', async () => {
      // Arrange
      const refreshTokenRequest = buildRefreshTokenRequest();
      const mockTokenResponse: TokenResponseDto = buildTokenPairResponse();
      authServiceMock.generateToken.mockResolvedValue(mockTokenResponse);
      // Act
      const response = await authController.login(refreshTokenRequest);
      // Assert
      expect(response).toBe(mockTokenResponse);
      expect(authServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(authServiceMock.generateToken).toHaveBeenCalledWith(
        refreshTokenRequest,
      );
    });

    it('should pass through exception raised from auth service', async () => {
      // Arrange
      const refreshTokenRequest = buildRefreshTokenRequest();
      const mockHttpException = new InternalServerErrorException('Some error');
      authServiceMock.generateToken.mockRejectedValue(mockHttpException);
      // Act
      await expect(authController.login(refreshTokenRequest)).rejects.toThrow(
        mockHttpException,
      );
      // Assert
      expect(authServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(authServiceMock.generateToken).toHaveBeenCalledWith(
        refreshTokenRequest,
      );
    });
  });
});
