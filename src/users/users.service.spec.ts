import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import UserService from './users.service.js';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createPrismaMock } from '../../test/mocks/prisma.mock.js';
import {
  buildSignUpRequest,
  buildUser,
} from '../../test/factories/user.factory.js';
import {
  buildNotFoundPrismaError,
  buildUniqueConstraintFailedPrismaError,
  buildUnknownPrismaError,
} from '../../test/utils/prisma-errors.js';

describe('UserService', () => {
  let userService: UserService;
  let prismaMock: ReturnType<typeof createPrismaMock>;
  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock = createPrismaMock();
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
      const signUpRequest = buildSignUpRequest();
      const newUser = buildUser();
      prismaMock.user.create.mockResolvedValue(newUser);
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
      expect(createdUser).toEqual(newUser);
    });

    it('should return appropriate response in case of email already exists', async () => {
      // Setup
      const signUpRequest = buildSignUpRequest();
      const uniqueConstraintFailedPrismaError =
        buildUniqueConstraintFailedPrismaError();
      prismaMock.user.create.mockRejectedValue(
        uniqueConstraintFailedPrismaError,
      );
      // Execute and assert
      await expect(userService.createUser(signUpRequest)).rejects.toThrow(
        new BadRequestException('User already exists.'),
      );
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });

    it('should return generic error in case of unknown prisma error', async () => {
      // Setup
      const signUpRequest = buildSignUpRequest();
      const unknownPrismaError = buildUnknownPrismaError();
      prismaMock.user.create.mockRejectedValue(unknownPrismaError);
      // Execute and assert
      await expect(userService.createUser(signUpRequest)).rejects.toThrow(
        new InternalServerErrorException('Unable to create new user.'),
      );
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('should return the user if it exists', async () => {
      // Setup
      const existingUser = buildUser();
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(existingUser);
      // Execute and assert
      await expect(userService.getUser(existingUser.email)).resolves.toEqual(
        existingUser,
      );
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            email: existingUser.email,
          },
        }),
      );
    });

    it('should throw prisma not found error if it doesnt not exist', async () => {
      // Setup
      const prismaException = buildNotFoundPrismaError();
      prismaMock.user.findUniqueOrThrow.mockRejectedValue(prismaException);
      // Execeute and assert
      await expect(userService.getUser('non existing user')).rejects.toThrow(
        prismaException,
      );
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });
});
