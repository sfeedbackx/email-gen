import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import {
  ContactResponseType,
  ContactWithDetailsResponseType,
  CreateContactType,
  UpdateContactType,
} from './dto/contacts.dto';
import { takeUniqueOrThrow } from '@database/drizzle/helper';

@Injectable()
export class ContactsService {
  constructor(private readonly contactRepository: ContactsRepository) { }

  async createContact(userId: string, data: CreateContactType): Promise<ContactResponseType> {
    const contact = await this.contactRepository
      .createContact({
        ...data,
        userId,
      })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Contact not created')),
      );

    return {
      ...contact,
      email: contact.email ?? undefined,
    };
  }

  async getContacts(userId: string): Promise<ContactResponseType[]> {
    const res = await this.contactRepository.findAllByUserId(userId);
    return res.map((r): ContactResponseType => {
      return {
        ...r,
        email: r.email ?? undefined,
      };
    });
  }

  async getContact(userId: string, contactId: number): Promise<ContactResponseType> {
    const contact = await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    return {
      ...contact,
      email: contact.email ?? undefined,
    };
  }

  async getContactWithDetails(
    userId: string,
    contactId: number,
  ): Promise<ContactWithDetailsResponseType> {
    const contact = await this.contactRepository.findByIdWithDetails(contactId, userId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return {
      ...contact,
      context: contact.context,
      documents: contact.documents.map((d) => {
        return {
          ...d,
          description: d.description ?? undefined,
        };
      }),
      email: contact.email ?? undefined,
    };
  }

  async updateContact(
    userId: string,
    contactId: number,
    data: UpdateContactType,
  ): Promise<ContactResponseType> {
    const contact = await this.contactRepository.findById(contactId, userId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updated = await this.contactRepository
      .updateContact(contactId, userId, data)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Contact not updated')),
      );

    return {
      ...updated,
      email: updated.email ?? undefined,
    };
  }

  async deleteContact(userId: string, contactId: number): Promise<void> {
    const contact = await this.contactRepository.findById(contactId, userId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactRepository
      .deleteContact(contactId, userId)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Contact not deleted')),
      );
    return;
  }
}
