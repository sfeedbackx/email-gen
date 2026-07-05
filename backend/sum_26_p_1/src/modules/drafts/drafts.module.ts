import { AiModule } from '@modules/ai/ai.module';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { MessagesModule } from '@modules/messages/messages.module';
import { ThreadsModule } from '@modules/threads/threads.module';
import { Module } from '@nestjs/common';
import { DraftsController } from './drafts.controller';
import { DraftsRepository } from './drafts.repository';
import { DraftsService } from './drafts.service';

@Module({
  imports: [ContactsModule, ThreadsModule, MessagesModule, AiModule],
  providers: [DraftsService, DraftsRepository],
  controllers: [DraftsController],
})
export class DraftsModule {}
