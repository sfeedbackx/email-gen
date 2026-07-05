import { ContactsModule } from '@modules/contacts/contacts.module';
import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsRepository } from './threads.repository';
import { ThreadsService } from './threads.service';

@Module({
  imports: [ContactsModule],
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
  exports: [ThreadsRepository],
})
export class ThreadsModule {}
