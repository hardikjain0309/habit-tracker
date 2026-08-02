import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { createJWTServiceMock } from '../../test/mocks/jwt-service.mock.js';
import { createPrismaMock } from '../../test/mocks/prisma.mock.js';
import AuthService from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import UserService from '../users/users.service.js';
import { createUserServiceMock } from '../../test/mocks/user-service.mock.js';
import argon2 from 'argon2';
import {
  buildUser,
  buildUserSession,
} from '../../test/factories/user.factory.js';
import {
  buildPasswordGrantTokenRequest,
  buildTokenPairResponse,
} from '../../test/factories/auth.factory.js';
import { createUUIDServiceMock } from '../../test/mocks/uuid-service.mock.js';
import { UUIDService } from '../tools/uuid.service.js';

describe('AuthService', () => {
  let jwtMock: ReturnType<typeof createJWTServiceMock>;
  let prismaServiceMock: ReturnType<typeof createPrismaMock>;
  let userServiceMock: ReturnType<typeof createUserServiceMock>;
  let uuidServiceMock: ReturnType<typeof createUUIDServiceMock>;
  let authService: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jwtMock = createJWTServiceMock();
    prismaServiceMock = createPrismaMock();
    userServiceMock = createUserServiceMock();
    uuidServiceMock = createUUIDServiceMock();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: jwtMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: UUIDService,
          useValue: uuidServiceMock,
        },
        AuthService,
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  describe('generateToken', () => {
    it('should return jwt signed token pair', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const mockUser = buildUser();
      userServiceMock.getUser.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      const mockLoginRequest = buildPasswordGrantTokenRequest();
      const mockUserSession = buildUserSession();
      const mockRefreshTokenUUID = 'refresh-uuid';
      const mockTokenPair = buildTokenPairResponse();
      uuidServiceMock.generateUUID
        .mockReturnValueOnce(mockUserSession.sessionId)
        .mockReturnValueOnce(mockRefreshTokenUUID);
      prismaServiceMock.userSessions.create.mockResolvedValue(mockUserSession);
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValue(mockUserSession.refreshTokenHash);
      jwtMock.sign.mockReturnValue(mockTokenPair.accessToken);
      // Act
      const generateTokenResponse =
        await authService.generateToken(mockLoginRequest);
      // Assert
      expect(userServiceMock.getUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUser).toHaveBeenCalledWith(
        mockLoginRequest.email,
      );
      expect(argon2.verify).toHaveBeenCalledTimes(1);
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.passwordHash,
        mockLoginRequest.password,
      );
      expect(jwtMock.sign).toHaveBeenCalledTimes(1);
      expect(jwtMock.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        sid: mockUserSession.sessionId,
      });
      expect(uuidServiceMock.generateUUID).toHaveBeenCalledTimes(2);
      expect(prismaServiceMock.userSessions.create).toHaveBeenCalledTimes(1);
      const expectedAccessTokenExpiry = new Date(now + 15 * 60 * 1000);
      const expectedRefreshTokenExpriry = new Date(now + 24 * 60 * 60 * 1000);
      expect(prismaServiceMock.userSessions.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          sessionId: mockUserSession.sessionId,
          refreshTokenHash: mockUserSession.refreshTokenHash,
          expiresAt: expectedRefreshTokenExpriry,
        },
      });
      const expectedRefreshToken = `${mockUserSession.sessionId}.${mockRefreshTokenUUID}`;
      expect(generateTokenResponse).toEqual({
        accessToken: mockTokenPair.accessToken,
        refreshToken: expectedRefreshToken,
        expiresAt: expectedAccessTokenExpiry,
      });
    });
  });
});
