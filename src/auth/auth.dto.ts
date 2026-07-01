import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignupRequestDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class TokenRequestDto {
  @IsIn(['password', 'refresh_token'])
  grantType!: 'password' | 'refresh_token';

  @ValidateIf((o: TokenRequestDto) => o.grantType === 'password')
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ValidateIf((o: TokenRequestDto) => o.grantType === 'password')
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ValidateIf((o: TokenRequestDto) => o.grantType === 'refresh_token')
  @IsNotEmpty()
  @IsString()
  refreshToken?: string;
}

export class TokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresAt!: Date;
}
