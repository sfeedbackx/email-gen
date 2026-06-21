import { ContactsRepository } from '@modules/contacts/contacts.repository';
import { ThreadsRepository } from '@modules/threads/threads.repository';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageType, MessageResponseType } from './dto/messages.dto';
import { takeUniqueOrThrow } from '@database/drizzle/helper';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessagesRepository,
    private readonly threadRepository: ThreadsRepository,
    private readonly contactRepository: ContactsRepository,
  ) { }

  async createMessage(
    userId: string,
    threadId: number,
    contactId: number,
    data: CreateMessageType,
  ): Promise<MessageResponseType> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    return this.messageRepository
      .createMessage({ ...data, threadId })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Message not created')),
      );
  }

  async getMessages(
    userId: string,
    contactId: number,
    threadId: number,
  ): Promise<MessageResponseType[]> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    return this.messageRepository.findAllByThreadId(threadId);
  }

  async deleteMessage(
    userId: string,
    contactId: number,
    threadId: number,
    messageId: number,
  ): Promise<void> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    const message = await this.messageRepository
      .findById(messageId, threadId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Message not found')));

    this.messageRepository
      .deleteMessage(message.id, threadId)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Message not deleted')),
      );
    return;
  }
}
