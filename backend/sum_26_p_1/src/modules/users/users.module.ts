import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './repository/users.repository';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  imports : [RolesModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule { }
