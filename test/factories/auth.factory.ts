import { TokenRequestDto, TokenResponseDto } from '../../src/auth/auth.dto.js';

export function buildPasswordGrantTokenRequest(): TokenRequestDto {
  return {
    grantType: 'password',
    email: 'hardik.j0309@gmail.com',
    password: 'password',
  };
}

export function buildRefreshTokenRequest(): TokenRequestDto {
  return {
    grantType: 'refresh_token',
    refreshToken: 'refresh-token',
  };
}

export function buildTokenPairResponse(): TokenResponseDto {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: new Date(Date.now(), 15 * 60 * 1000), // 15 mins from now
  };
}
