import { Injectable } from '@nestjs/common';
import { SignupRequestDto } from '../auth/auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export default class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(request: SignupRequestDto) {
    const user = await this.prisma.user.create({
      data: request,
    });
    return user;
  }
}
