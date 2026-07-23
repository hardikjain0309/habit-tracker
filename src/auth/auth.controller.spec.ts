import { jest } from '@jest/globals';
import UserService from '../users/users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import argon2 from 'argon2';
import AuthService from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { User } from '../prisma/generated/client.js';

const prismaMock = {
  user: {
    create: jest.fn<() => Promise<User>>(),
  },
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const userModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
      controllers: [AuthController],
    }).compile();
    authController = userModule.get(AuthController);
  });

  describe('Sign Up API', () => {
    it('should return 201 with user entity on successful signup', async () => {
      const newUserEntity = {
        email: 'hardik.j0309@gmail.com',
        id: 'some-uuid',
        createdAt: new Date(),
        name: 'Hardik Jain',
        passwordHash: await argon2.hash('password'),
      };
      prismaMock.user.create.mockResolvedValue(newUserEntity);
      const signUpResponse = await authController.signup({
        email: 'hardik.j0309@gmail.com',
        name: 'Hardik Jain',
        password: 'password',
      });
      expect(signUpResponse.email).toBe('hardik.j0309@gmail.com');
      expect(signUpResponse.name).toBe('Hardik Jain');
      expect(signUpResponse.passwordHash).toBeUndefined();
      expect(signUpResponse.id).toBe('some-uuid');
      expect(signUpResponse.createdAt).toBeTruthy();
    });
  });
});
