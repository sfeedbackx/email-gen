import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { PermissionRepository } from './repository/permission.repository';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionRepository],
  exports: [PermissionRepository],
})
export class PermissionsModule {}
