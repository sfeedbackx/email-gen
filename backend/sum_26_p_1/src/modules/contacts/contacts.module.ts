import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repository';
import { ContactsController } from './contacts.controller';

@Module({
  providers: [ContactsService, ContactsRepository],
  controllers: [ContactsController],
  exports : [ContactsRepository]
})
export class ContactsModule {}
