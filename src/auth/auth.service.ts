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
  private async generateTokenPair(sessionId: string, userId: string) {
    const accessToken = this.jwt.sign({
      sub: userId,
      sid: sessionId,
    });
    const expiresAt = new Date().valueOf() + 15 * 60 * 1000; // 15 mins expiry
    const refreshToken = `${sessionId}.${randomUUID()}`;
    const refreshTokenHash = await argon2.hash(refreshToken);
    return {
      accessToken,
      expiresAt,
      refreshToken,
      refreshTokenHash,
    };
  }

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
    const refreshTokenExpiresAt = new Date().valueOf() + 24 * 60 * 60 * 1000; // 1d expiry
    const tokenPair = await this.generateTokenPair(sessionId, user.id);

    // Store refresh token and session id in DB
    await this.prismaService.userSessions.create({
      data: {
        userId: user.id,
        sessionId,
        refreshTokenHash: tokenPair.refreshTokenHash,
        expiresAt: new Date(refreshTokenExpiresAt),
      },
    });
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresAt: tokenPair.expiresAt,
    };
  }

  private async refreshToken(request: TokenRequestDto) {
    const sessionId = request.refreshToken.split('.')?.[0];
    if (!sessionId) {
      console.log('no session id', sessionId);
      throw new Error('Invalid refresh token');
    }
    // Validate refresh token from user sessions table
    const userSession = await this.prismaService.userSessions.findUnique({
      where: {
        sessionId,
      },
    });
    if (
      !userSession ||
      !(await argon2.verify(userSession.refreshTokenHash, request.refreshToken))
    ) {
      throw new Error('Invalid refresh token');
    }

    if (userSession.expiresAt.valueOf() < new Date().valueOf()) {
      await this.prismaService.userSessions.delete({
        where: {
          sessionId: userSession.sessionId,
        },
      });
      throw new Error('Refresh token has expired');
    }
    // Generate new access token and refresh token pair
    const tokenPair = await this.generateTokenPair(
      userSession.sessionId,
      userSession.userId,
    );
    // Update user session
    await this.prismaService.userSessions.update({
      data: {
        refreshTokenHash: tokenPair.refreshTokenHash,
      },
      where: {
        sessionId: userSession.sessionId,
      },
    });
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresAt: tokenPair.expiresAt,
    };
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
