import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import UsersModule from '../users/users.module.js';
import AuthService from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../app.config.js';
import PrismaModule from '../prisma/prisma.module.js';
import ToolsModule from '../tools/tools.module.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: AppConfig.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
    PrismaModule,
    ToolsModule,
  ],
})
export default class AuthModule {}
