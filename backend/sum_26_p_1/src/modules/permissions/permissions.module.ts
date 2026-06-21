import { Module } from '@nestjs/common';
import { PermissionRepository } from './repository/permission.repository';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionRepository],
  exports: [PermissionRepository],
})
export class PermissionsModule {}
