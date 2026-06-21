import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository';
import { ContactsRepository } from '@modules/contacts/contacts.repository';
import {
  CreateThreadType,
  ThreadResponseType,
  ThreadWithDetailsResponseType,
  UpdateThreadType,
} from './dto/threads.dto';
import { takeUniqueOrThrow } from '@database/drizzle/helper';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly threadRepository: ThreadsRepository,
    private readonly contactRepository: ContactsRepository,
  ) { }

  async createThread(
    userId: string,
    contactId: number,
    data: CreateThreadType,
  ): Promise<ThreadResponseType> {
    await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    return this.threadRepository
      .createThread({ ...data, contactId })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Thread not created')),
      );
  }

  async getThreads(userId: string, contactId: number): Promise<ThreadResponseType[]> {
    await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    return this.threadRepository.findAllByContactId(contactId);
  }

  async getThread(
    userId: string,
    contactId: number,
    threadId: number,
  ): Promise<ThreadResponseType> {
    const [, thread] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    return thread;
  }

  async getThreadWithDetails(
    userId: string,
    contactId: number,
    threadId: number,
  ): Promise<ThreadWithDetailsResponseType> {
    const [, thread] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository.findByIdWithDetails(threadId, contactId).then((value) => {
        if (!value) throw new NotFoundException('Thread not found');
        return value;
      }),
    ]);

    return thread;
  }

  async updateThread(
    userId: string,
    contactId: number,
    threadId: number,
    data: UpdateThreadType,
  ): Promise<ThreadResponseType> {
    const [, thread] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    return this.threadRepository
      .updateThread(thread.id, contactId, data)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Thread not updated')),
      );
  }

  async deleteThread(userId: string, contactId: number, threadId: number): Promise<void> {
    const [, thread] = await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    await this.threadRepository
      .deleteThread(thread.id, contactId)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Thread not deleted')),
      );
    return;
  }
}
