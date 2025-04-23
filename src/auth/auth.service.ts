import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from 'src/users/user.model';
import { SetPasswordDto } from 'src/users/dto/set-password.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    const tokens = await this.getTokens(user.id, user.email)
    return { user, ...tokens }
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.findByEmail(dto.email);
  
    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }
  
    if (user.provider !== 'local') {
      throw new UnauthorizedException(`Please log in with ${user.provider}`);
    }
  
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
  
    const tokens = await this.getTokens(user.id, user.email);
    user.refreshToken = tokens.refreshToken;
    await user.save();
  
    return { user, ...tokens };
  }  
  
  async validateOAuthLogin(profile: any) {
    let user = await this.userService.findByOAuth(profile.provider, profile.providerId)

    if (!user) {
      user = await this.userService.createOAuthUser(profile)
    }

    const tokens = await this.getTokens(user.id, user.email)
    user.refreshToken = tokens.refreshToken
    user.save()
    return { user, ...tokens }
  }

  async getTokens(userId: string, email: string) {
    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '1h' }),
      this.jwtService.signAsync({ sub: userId }, { expiresIn: '7d' })
    ])

    return { accessToken, refreshToken }
  }

  async handleGitHubLogin(profile: any) {
    let user = await this.userService.findByGitHubId(profile.id)
    if (!user) {
      user = await this.userService.createOAuthUser({
        provider: 'github',
        githubId: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
      });
    }
    
    return this.login(user)
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken)
    const user = await this.userService.findById(payload.sub)

    if (!user || user.refreshToken !== refreshToken) throw new ForbiddenException();

    return this.login(user)
  }

  async setPassword(dto: SetPasswordDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user) throw new NotFoundException('User not found')

    if (user.provider === 'local') {
      throw new BadRequestException('User already has a local password')
    }

    user.password = dto.password;
    user.provider = 'local';
    await user.save();

    return {
      message: "Password set successfully. You can now log in with email and password."
    }
  }
}
