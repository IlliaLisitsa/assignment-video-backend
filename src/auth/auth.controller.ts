import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRespDto } from './dto/login-resp.dto';
import { LoginReqDto } from './dto/login-req.dto';
import { SignUpReqDto } from './dto/signUp-req.dto';
import { SignUpRespDto } from './dto/signUp-resp.dto';
import { RefreshRespDto } from './dto/refresh-resp.dto';
import { RefreshReqDto } from './dto/refresh-req.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200, type: LoginRespDto })
  @HttpCode(200)
  @Post('/sign-in')
  async login(@Body() userDto: LoginReqDto): Promise<LoginRespDto> {
    const { user, authToken, refreshToken } =
      await this.authService.login(userDto);

    return {
      authToken,
      refreshToken,
      user,
    };
  }

  @ApiResponse({ status: 200, type: SignUpRespDto })
  @HttpCode(200)
  @Post('/sign-up')
  async registration(@Body() userDto: SignUpReqDto): Promise<SignUpRespDto> {
    const { success } = await this.authService.registration(userDto);

    return { success };
  }

  @ApiResponse({
    status: 200,
    type: LoginRespDto,
  })
  @HttpCode(200)
  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshReqDto): Promise<RefreshRespDto> {
    const { user, authToken, refreshToken } =
      await this.authService.refreshTokens(refreshDto.refreshToken);

    return {
      authToken,
      refreshToken,
      user,
    };
  }
}
