import { Injectable } from '@nestjs/common';
import { SignupRequestDto } from '../auth/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import argon2 from 'argon2';
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
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }
}
