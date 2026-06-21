import { PermissionsModule } from '@modules/permissions/permissions.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RolesRepository } from './repository/roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
