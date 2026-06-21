import { AuthService } from './auth.service';

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
import type { CookieOptions, Response } from 'express';
import { ZodSerializerDto } from 'nestjs-zod';
import { UsersService } from '../users/users.service';
import { Cookies } from './decorators/cookie.decorator';
import { GetHeader } from './decorators/getHeaderField.decorator';
import { GetIp } from './decorators/ip.decorator';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto, LoginDto, LogoutDto, RegisterDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/login-auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    //private googleAuthService: GoogleAuthService,
    private userRepository: UserRepository,
    private appConfigService: AppConfigService,
  ) {
    this.cookieOptions = {
      httpOnly: true,
      secure: this.appConfigService.nodeEnv === 'production',
      sameSite: 'none',
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
      throw new ConflictException();
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
    
    console.log(oldRefreshToken)
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

  ) {
    return this.authService.logout(oldRefreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Req() req) {
    return this.authService.logoutAll(req.user.id);
  }
  /*
  // Google OAuth routes
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // This route initiates the Google OAuth flow
    // The guard will redirect to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ZodSerializerDto(LoginResponseDto)
  async googleAuthCallback(
    @Locale() locale: string,
    @Req() req,
    @GetHeader('user-agent', new ZodValidationPipe(UserAgentHeader)) userAgent: string,
    @GetIp(new ZodValidationPipe(IpSchema)) ip: string,
  ) {
    return this.authService.googleLogin(locale, req.user, ip, userAgent);
  }

  // For Flutter integration: This endpoint will be called directly with the Google OAuth token
  @Public()
  @Post('google/mobile')
  @ZodSerializerDto(LoginResponseDto)
  async googleMobileLogin(
    @Locale() locale: string,
    @Body() body: { idToken: string },
    @GetHeader('user-agent', new ZodValidationPipe(UserAgentHeader)) userAgent: string,
    @GetIp(new ZodValidationPipe(IpSchema)) ip: string,
  ) {
    // Verify the Google token
    const googleUser = await this.googleAuthService.verifyGoogleToken(body.idToken);
    return this.authService.googleLogin(locale, googleUser, ip, userAgent);
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {
    // This route initiates the Google OAuth flow
    // The guard will redirect to Google
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ZodSerializerDto(LoginResponseDto)
  async facebookAuthCallback(
    @Locale() locale: string,
    @Req() req,
    @GetHeader('user-agent', new ZodValidationPipe(UserAgentHeader)) userAgent: string,
    @GetIp(new ZodValidationPipe(IpSchema)) ip: string,
  ) {
    return this.authService.facebookLogin(locale, req.user, ip, userAgent);
  }*/
}
