import { AppConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { RolesModule } from '@modules/roles/roles.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshProvider } from './providers/refresh/refresh.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AppConfigService } from '@config/config.service';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: {
          expiresIn: appConfigService.jwtExpiration,
        },
      }),
      inject: [AppConfigService],
    }),
    DatabaseModule,
    AppConfigModule,
  ],
  providers: [AuthService, RefreshProvider, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
