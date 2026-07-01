import { Module } from '@nestjs/common';
import UserService from './users.service.js';
import PrismaModule from '../prisma/prisma.module.js';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
})
export default class UsersModule {}
