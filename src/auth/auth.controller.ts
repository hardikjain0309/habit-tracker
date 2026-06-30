import { Body, Controller, Post } from '@nestjs/common';
import {
  SignupRequestDto,
  TokenRequestDto,
  TokenResponseDto,
} from './auth.dto';
import UserService from '../users/users.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post('signup')
  async signup(@Body() request: SignupRequestDto): Promise<User> {
    return await this.userService.createUser(request);
  }

  @Post('token')
  login(@Body() request: TokenRequestDto) {
    return {
      accessToken: 'abc',
      refreshToken: request.refreshToken || 'def',
      expiresAt: new Date(new Date().valueOf() + 60 * 60 * 1000),
    } as TokenResponseDto;
  }
}
