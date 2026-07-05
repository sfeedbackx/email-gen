import { RolesModule } from '@modules/roles/roles.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [RolesModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
