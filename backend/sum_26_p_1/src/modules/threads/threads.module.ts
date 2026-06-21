import { ContactsModule } from '@modules/contacts/contacts.module';
import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { ThreadsRepository } from './threads.repository';

@Module({
  imports: [ContactsModule],
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
  exports : [ThreadsRepository]
})
export class ThreadsModule { }
