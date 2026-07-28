import { Body, Controller, Post } from '@nestjs/common';
import {
  SignupRequestDto,
  SignUpResponseDto,
  TokenRequestDto,
  TokenResponseDto,
} from './auth.dto.js';
import UserService from '../users/users.service.js';
import AuthService from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() request: SignupRequestDto): Promise<SignUpResponseDto> {
    const userData = await this.userService.createUser(request);
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt,
    };
  }

  @Post('token')
  async login(@Body() request: TokenRequestDto): Promise<TokenResponseDto> {
    return await this.authService.generateToken(request);
  }
}
