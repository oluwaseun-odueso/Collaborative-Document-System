import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string

  @IsOptional()
  avatar?: string
}

export class OAuthUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  provider?: 'local' | 'google' | 'github';

  @IsOptional()
  @IsString()
  githubId?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  name?: string

  @IsOptional()
  avatar?: string
}