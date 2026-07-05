import { AppConfigService } from '@config/config.service';
import { UserWithPermissions } from '@modules/users/dto/users.dto';
import { UserRepository } from '@modules/users/repository/users.repository';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { CookieOptions, Response } from 'express';
import { ZodSerializerDto } from 'nestjs-zod';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Cookies } from './decorators/cookie.decorator';
import { GetHeader } from './decorators/getHeaderField.decorator';
import { GetIp } from './decorators/ip.decorator';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/login-auth.guard';
@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private userRepository: UserRepository,
    private appConfigService: AppConfigService,
  ) {
    const isProduction = this.appConfigService.nodeEnv === 'production';
    this.cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: this.appConfigService.maxAge,
    };
  }

  @Public()
  @Post('register')
  @ZodSerializerDto(AuthResponseDto)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @GetHeader('user-agent') userAgent: string,
    @GetIp() ip: string,
  ) {
    const existingUser = await this.userRepository
      .findByEmail(registerDto.email)
      .then((value) => value[0]);
    if (existingUser) {
      throw new ConflictException('email already used');
    }

    const hashedPassword: string = await this.authService.hashPassword(registerDto.password);

    // Create new user
    const user = await this.usersService.createLocalUser({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate tokens and return
    const { accessToken, refreshToken } = await this.authService.login(user, ip, userAgent);

    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return { data: { accessToken }, statusCode: res.statusCode };
  }

  /**
   * Login with local strategy. The Guard will execute first and validate the user credentials (email and password) then
   * passport will attach the user object to the request object automatically and call the validate method in the strategy.
   * @param req - Request object
   * @param userAgent - User agent string
   * @param ip - IP address
   * @returns Login response
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ZodSerializerDto(AuthResponseDto)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: { user: UserWithPermissions },
    @Res({ passthrough: true }) res: Response,
    @GetHeader('user-agent') userAgent: string,
    @GetIp() ip: string,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req.user, ip, userAgent);

    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return { data: { accessToken }, statusCode: res.statusCode };
  }

  @Public()
  @Post('refresh')
  @ZodSerializerDto(AuthResponseDto)
  async refreshTokens(
    @GetHeader('user-agent') userAgent: string,
    @GetIp() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Cookies('refresh_token') oldRefreshToken: string,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      oldRefreshToken,
      ip,
      userAgent,
    );

    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return { data: { accessToken }, statusCode: res.statusCode };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Cookies('refresh_token') oldRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(oldRefreshToken);
    res.clearCookie('refresh_token');
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Req() req) {
    return this.authService.logoutAll(req.user.id);
  }
}
