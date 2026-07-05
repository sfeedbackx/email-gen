import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsRepository } from './contacts.repository';
import { ContactsService } from './contacts.service';

@Module({
  providers: [ContactsService, ContactsRepository],
  controllers: [ContactsController],
  exports: [ContactsRepository],
})
export class ContactsModule {}
