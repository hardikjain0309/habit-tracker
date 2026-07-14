import { Injectable } from '@nestjs/common';
import { TokenRequestDto, TokenResponseDto } from './auth.dto.js';
import UserService from '../users/users.service.js';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  private async generateTokenWithCreds(
    request: TokenRequestDto,
  ): Promise<TokenResponseDto> {
    console.log(process.env);
    // Get User from DB
    const user = await this.userService.getUser(request.email);
    // Validate user creds from DB
    const isValidPassword = await argon2.verify(
      user.passwordHash,
      request.password,
    );
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }
    // Generate new access token and refresh token pair
    const sessionId = randomUUID();
    const expiresAt = new Date().valueOf() + 15 * 60 * 1000; // 15 mins expiry
    const refreshTokenExpiresAt = new Date().valueOf() + 24 * 60 * 60 * 1000; // 1 hour expiry
    const accessToken = this.jwt.sign({
      sub: user.id,
      sid: sessionId,
    });
    const refreshToken = this.jwt.sign(
      {
        sub: user.id,
        sid: sessionId,
      },
      {
        expiresIn: '1d',
      },
    );
    const refreshTokenHash = await argon2.hash(refreshToken);
    // Store refresh token and session id in DB
    await this.prismaService.userSessions.create({
      data: {
        sessionId,
        refreshTokenHash,
        expiresAt: new Date(refreshTokenExpiresAt),
      },
    });
    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  private async refreshToken(request: TokenRequestDto) {
    console.log(request);
    // Validate refresh token validity from DB
    // Generate new access token and refresh token pair
  }

  async generateToken(request: TokenRequestDto) {
    switch (request.grantType) {
      case 'password':
        return await this.generateTokenWithCreds(request);
      case 'refresh_token':
        return await this.refreshToken(request);
    }
  }
}
