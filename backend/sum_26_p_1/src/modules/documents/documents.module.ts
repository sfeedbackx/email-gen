import { ContactsModule } from '@modules/contacts/contacts.module';
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';

@Module({
  imports: [ContactsModule],
  providers: [DocumentsService, DocumentsRepository],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
