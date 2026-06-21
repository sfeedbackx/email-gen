import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { DocumentsRepository } from './documents.repository';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [ContactsModule],
  providers: [DocumentsService, DocumentsRepository],
  controllers: [DocumentsController],
})
export class DocumentsModule { }
