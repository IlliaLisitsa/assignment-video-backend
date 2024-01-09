import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { SignUpReqDto } from './dto/signUp-req.dto';
import * as bcrypt from 'bcryptjs';
import { LoginReqDto } from './dto/login-req.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    userDto: LoginReqDto,
  ): Promise<{ user: User; authToken: string; refreshToken: string }> {
    const user = await this.validateUser(userDto);

    const { authToken, refreshToken } = await this.generateTokens(user);

    return { user, authToken, refreshToken };
  }

  async registration(userDto: SignUpReqDto): Promise<{ success: boolean }> {
    const [existingUser] = await this.userService.findByEmail(userDto.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 6);

    await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });

    return { success: true };
  }

  async generateTokens(
    user: User,
  ): Promise<{ authToken: string; refreshToken: string }> {
    const payload = { email: user.email, id: user.id };

    return {
      authToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '4h' }),
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ user: User; authToken: string; refreshToken: string }> {
    try {
      const { id } = this.jwtService.verify(refreshToken);

      const user = await this.userService.findOneById(id as string);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const payload = { email: user.email, id: user.id };

      return {
        user: user,
        authToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '4h' }),
      };
    } catch (e) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }
  }

  private async validateUser(userDto: LoginReqDto): Promise<User> {
    const user = await this.userService.findOneByEmail(userDto.email, true);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.password;

    return user;
  }
}
