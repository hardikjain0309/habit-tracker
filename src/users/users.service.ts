import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignupRequestDto } from '../auth/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
@Injectable()
export default class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(request: SignupRequestDto) {
    const passwordHash = await argon2.hash(request.password);
    const userData = {
      ...request,
      passwordHash,
      password: undefined,
    };
    try {
      const user = await this.prisma.user.create({
        data: userData,
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('User already exists.');
      }
      throw new InternalServerErrorException('Unable to create new user.');
    }
  }

  async getUser(email: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }
}
