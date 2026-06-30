import { Module } from '@nestjs/common';
import UserService from './users.service';
import PrismaModule from '../prisma/prisma.module';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
})
export default class UsersModule {}
