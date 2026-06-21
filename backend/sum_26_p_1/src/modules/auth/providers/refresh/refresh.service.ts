import * as crypto from 'node:crypto';
import { refreshTokens } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, eq, isNull } from 'drizzle-orm';
import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { RefreshToken } from '@modules/auth/dto/tokens.dto';

@Injectable()
export class RefreshProvider {
  private readonly logger = new Logger(RefreshProvider.name);
  constructor(
    @InjectDB() private db: DatabaseContext,
    private configService: ConfigService,
  ) { }

  async generateRefreshToken(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<RefreshToken> {
    // Generate a secure random token
    const token = crypto.randomBytes(40).toString('hex');

    // Get token expiration time from config
    const expirationDays = this.configService.get<number>('REFRESH_TOKEN_EXPIRATION_DAYS') || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // Save refresh token to database
    const [refreshToken] = await this.db
      .insert(refreshTokens)
      .values({
        userId,
        token,
        expiresAt,
        userAgent,
        ipAddress,
      })
      .returning();

    return {
      ...refreshToken,
      revokedAt: refreshToken.revokedAt ?? undefined,
      replacedByToken: refreshToken.replacedByToken ?? undefined,
    };
  }

  async validateRefreshToken(token: string): Promise<RefreshToken> {
    const refreshTokenFound = await this.db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt)))
      .then((value) => takeUniqueOrThrow(value, new ForbiddenException('Invalid RefreshTokennnn')));

    // Check if token has expired
    if (new Date() > refreshTokenFound.expiresAt) {
      await this.revokeRefreshToken(refreshTokenFound.id);
      throw new UnauthorizedException('RefreshToken expired');
    }

    return {
      ...refreshTokenFound,
      revokedAt: refreshTokenFound.revokedAt ?? undefined,
      replacedByToken: refreshTokenFound.replacedByToken ?? undefined,
    };
  }

  async revokeRefreshToken(id: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, id));
  }

  async replaceRefreshToken(
    currentTokenId: number,
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<RefreshToken> {
    // Generate new refresh token
    const newRefreshToken = await this.generateRefreshToken(userId, ipAddress, userAgent);

    // Revoke old token and link to new one
    await this.db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        replacedByToken: newRefreshToken.token,
      })
      .where(eq(refreshTokens.id, currentTokenId));

    return newRefreshToken;
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    const now = new Date();

    await this.db
      .update(refreshTokens)
      .set({ revokedAt: now })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }
}
