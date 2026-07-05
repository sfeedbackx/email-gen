import { ContactsModule } from '@modules/contacts/contacts.module';
import { ThreadsModule } from '@modules/threads/threads.module';
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

@Module({
  imports: [ContactsModule, ThreadsModule],
  providers: [MessagesService, MessagesRepository],
  controllers: [MessagesController],
  exports: [MessagesRepository],
})
export class MessagesModule {}
