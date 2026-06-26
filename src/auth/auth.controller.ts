import { Body, Controller, Post } from '@nestjs/common';
import { SignUpRequestDto, TokenRequestDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('signup')
  signUp(@Body() body: SignUpRequestDto) {
    return {
      user: body.email,
    };
  }

  @Post('token')
  login(@Body() body: TokenRequestDto) {
    return {
      accessToken: 'abc',
      refreshToken: body.refreshToken || 'def',
      accessTokenExpiry: '10-12-2026T12:23:23:123123Z',
      refreshTokeExpiry: '10-12-2026T12:23:23:123123Z',
    };
  }
}
