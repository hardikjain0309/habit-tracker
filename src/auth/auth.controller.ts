import { Body, Controller, Post } from '@nestjs/common';
import { SignupRequestDto, TokenRequestDto } from './auth.dto.js';
import UserService from '../users/users.service.js';
import AuthService from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() request: SignupRequestDto) {
    const userData = await this.userService.createUser(request);
    return {
      ...userData,
      passwordHash: undefined,
    };
  }

  @Post('token')
  async login(@Body() request: TokenRequestDto) {
    return await this.authService.generateToken(request);
  }
}
