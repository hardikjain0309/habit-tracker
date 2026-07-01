import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import UsersModule from '../users/users.module.js';

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
})
export default class AuthModule {}
