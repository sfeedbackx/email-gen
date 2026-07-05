import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { ContactsRepository } from '@modules/contacts/contacts.repository';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentType, DocumentResponseType, UpdateDocumentType } from './dto/documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documentRepository: DocumentsRepository,
    private readonly contactRepository: ContactsRepository,
  ) {}

  async createDocument(
    userId: string,
    contactId: number,
    data: CreateDocumentType,
  ): Promise<DocumentResponseType> {
    await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    const res = await this.documentRepository
      .createDocument({ ...data, contactId })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Document not created')),
      );
    return {
      ...res,
      description: res.description ?? undefined,
    };
  }

  async getDocuments(userId: string, contactId: number): Promise<DocumentResponseType[]> {
    await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    const contacts = await this.documentRepository.findAllByContactId(contactId);
    return contacts.map((c): DocumentResponseType => {
      return {
        ...c,
        description: c.description ?? undefined,
      };
    });
  }

  async getDocument(
    userId: string,
    contactId: number,
    documentId: number,
  ): Promise<DocumentResponseType> {
    const [, document] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.documentRepository
        .findById(documentId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Document not found'))),
    ]);

    return {
      ...document,
      description: document.description ?? undefined,
    };
  }

  async updateDocument(
    userId: string,
    contactId: number,
    documentId: number,
    data: UpdateDocumentType,
  ): Promise<DocumentResponseType> {
    const [, document] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.documentRepository
        .findById(documentId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Document not found'))),
    ]);

    const res = await this.documentRepository
      .updateDocument(document.id, contactId, data)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Document not updated')),
      );
    return {
      ...res,
      description: res.description ?? undefined,
    };
  }

  async deleteDocument(userId: string, contactId: number, documentId: number): Promise<void> {
    const [, document] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.documentRepository
        .findById(documentId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Document not found'))),
    ]);

    await this.documentRepository
      .deleteDocument(document.id, contactId)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Document not deleted')),
      );
    return;
  }
}
