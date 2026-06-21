import { Module } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { ThreadsModule } from '@modules/threads/threads.module';
import { MessagesModule } from '@modules/messages/messages.module';
import { AiModule } from '@modules/ai/ai.module';
import { DraftsRepository } from './drafts.repository';

@Module({
  imports: [ContactsModule, ThreadsModule, MessagesModule, AiModule],
  providers: [DraftsService , DraftsRepository],
  controllers: [DraftsController],
})
export class DraftsModule { }
