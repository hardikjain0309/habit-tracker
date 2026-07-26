import { TokenRequestDto, TokenResponseDto } from '../../src/auth/auth.dto.js';

export function buildPasswordGrantTokenRequest(): Partial<TokenRequestDto> {
  return {
    grantType: 'password',
    email: 'hardik.j0309@gmail.com',
    password: 'password',
  };
}

export function buildTokenPairResponse(): TokenResponseDto {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: 123,
  };
}
