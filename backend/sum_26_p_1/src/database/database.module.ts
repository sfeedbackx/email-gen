import { Global, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';
import { AppConfigModule } from 'src/config/config.module';
import { ConnectionProvider, injectConnectionToken } from './providers/connection.provider';
import { DatabaseProvider } from './providers/database.provider';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [ConnectionProvider, DatabaseProvider],
  exports: [ConnectionProvider, DatabaseProvider],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const conn = this.moduleRef.get<Pool>(injectConnectionToken());
    this.logger.log('Closing database connection...');
    await conn.end();
  }
}
