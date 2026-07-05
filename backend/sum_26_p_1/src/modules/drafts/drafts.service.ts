import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { AiService } from '@modules/ai/ai.service';
import { ContactsRepository } from '@modules/contacts/contacts.repository';
import { MessageResponseType } from '@modules/messages/dto/messages.dto';
import { MessagesRepository } from '@modules/messages/messages.repository';
import { ThreadsRepository } from '@modules/threads/threads.repository';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DraftsRepository } from './drafts.repository';
import { DraftResponseType, GenerateDraftType, UpdateDraftType } from './dto/drafts.dto';

@Injectable()
export class DraftsService {
  constructor(
    private readonly draftRepository: DraftsRepository,
    private readonly threadRepository: ThreadsRepository,
    private readonly contactRepository: ContactsRepository,
    private readonly messageRepository: MessagesRepository,
    private readonly aiService: AiService,
  ) {}

  async generateDraft(
    userId: string,
    contactId: number,
    threadId: number,
    data: GenerateDraftType,
  ): Promise<DraftResponseType> {
    const contact = await this.contactRepository
      .findById(contactId, userId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found')));

    const thread = await this.threadRepository
      .findById(threadId, contactId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found')));

    // get full thread history + contact context for AI
    const threadMessages = await this.messageRepository.findAllByThreadId(threadId);

    const generatedContent = await this.aiService.generateEmail({
      contact,
      thread,
      messages: threadMessages,
      prompt: data.prompt,
    });

    const draft = await this.draftRepository.createDraft({
      threadId,
      content: generatedContent,
      prompt: data.prompt,
    });

    if (!draft) {
      throw new InternalServerErrorException('Draft not created');
    }

    return draft;
  }

  async getDrafts(
    userId: string,
    contactId: number,
    threadId: number,
  ): Promise<DraftResponseType[]> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    return this.draftRepository.findAllByThreadId(threadId);
  }

  async updateDraft(
    userId: string,
    contactId: number,
    threadId: number,
    draftId: number,
    data: UpdateDraftType,
  ): Promise<DraftResponseType> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    const draft = await this.draftRepository
      .findById(draftId, threadId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Draft not found')));

    const updated = await this.draftRepository
      .updateDraft(draftId, threadId, data)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Draft not updated')),
      );

    return updated;
  }

  async deleteDraft(
    userId: string,
    contactId: number,
    threadId: number,
    draftId: number,
  ): Promise<DraftResponseType> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    const draft = await this.draftRepository
      .findById(draftId, threadId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Draft not found')));

    return this.draftRepository
      .deleteDraft(draftId, threadId)
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Draft not deleted')),
      );
  }

  async promoteDraft(
    userId: string,
    contactId: number,
    threadId: number,
    draftId: number,
  ): Promise<MessageResponseType> {
    await Promise.all([
      this.contactRepository
        .findById(contactId, userId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Contact not found'))),
      this.threadRepository
        .findById(threadId, contactId)
        .then((value) => takeUniqueOrThrow(value, new NotFoundException('Thread not found'))),
    ]);

    const draft = await this.draftRepository
      .findById(draftId, threadId)
      .then((value) => takeUniqueOrThrow(value, new NotFoundException('Draft not found')));

    const message = await this.messageRepository
      .createMessage({
        threadId,
        role: 'ME',
        content: draft.content,
      })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Message not created')),
      );

    await this.draftRepository.deleteDraft(draftId, threadId);

    return message;
  }
}
