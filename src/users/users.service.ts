import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUsername = await this.userModel.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const user = new User();
    user.email = dto.email;
    user.username = dto.username;
    user.password = dto.password;
    user.provider = 'local';
    user.name = dto.name;
    console.log('User: ', user);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByGitHubId(githubId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { githubId } });
  }

  async findByOAuth(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    if (provider === 'google') {
      return this.userModel.findOne({ where: { googleId: providerId } });
    } else if (provider === 'github') {
      return this.findByGitHubId(providerId);
    }
    return null;
  }

  async createOAuthUser(profile: any): Promise<User> {
    const user = new User();
    user.email = profile.email;
    user.username = profile.username || profile.email?.split('@')[0];
    user.provider = profile.provider;
    if (profile.provider === 'google') user.googleId = profile.providerId;
    if (profile.provider === 'github') user.githubId = profile.providerId;
    user.name = profile.displayName || profile.name;
    user.avatar = profile.photos?.[0]?.value || null;
    return user.save();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.refreshToken = refreshToken;
    await user.save();
  }
}
