import { Test, TestingModule } from '@nestjs/testing';
import { DraftsService } from '@modules/drafts/drafts.service';
import { AiService } from '@modules/ai/ai.service';
import { DraftsRepository } from '@modules/drafts/drafts.repository';
import { ThreadsRepository } from '@modules/threads/threads.repository';
import { ContactsRepository } from '@modules/contacts/contacts.repository';
import { MessagesRepository } from '@modules/messages/messages.repository';

// ── mock data ──────────────────────────────────────────────────────
const mockContact = {
  id: 1,
  name: 'Sarah Mansour',
  email: 'sarah@example.com',
  context: 'Student asking about exam grades',
  language: 'fr',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockThread = {
  id: 1,
  contactId: 1,
  subject: 'Question about October exam',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockMessages = [
  {
    id: 1,
    threadId: 1,
    role: 'CONTACT',
    content: "Bonjour, je n'arrive pas à trouver mon résultat pour l'examen d'octobre.",
    createdAt: new Date(),
  }
]

const mockDraft = {
  id: 1,
  threadId: 1,
  content: 'Bonjour Sarah, merci de votre message...',
  prompt: 'Reply politely about exam results',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── mock repositories ──────────────────────────────────────────────
const mockContactRepository = {
  findById: jest.fn().mockResolvedValue([mockContact]),
}

const mockThreadRepository = {
  findById: jest.fn().mockResolvedValue([mockThread]),
}

const mockMessageRepository = {
  findAllByThreadId: jest.fn().mockResolvedValue(mockMessages),
}

const mockDraftRepository = {
  createDraft: jest.fn().mockResolvedValue(mockDraft),
  findAllByThreadId: jest.fn().mockResolvedValue([mockDraft]),
}

// ── benchmark ──────────────────────────────────────────────────────
const MODELS = ['qwen-2.5'] // ← add your models here

const promptData = {
  userId: 'user-1',
  userFirstName: 'Ahmed',
  userLastName: 'Benali',
  contactId: 1,
  threadId: 1,
  data: { prompt: 'Reply politely about the exam results delay' },
}

describe('DraftsService - Model Benchmark', () => {
  let service: DraftsService
  let aiService: AiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftsService,
        { provide: DraftsRepository, useValue: mockDraftRepository },
        { provide: ThreadsRepository, useValue: mockThreadRepository },
        { provide: ContactsRepository, useValue: mockContactRepository },
        { provide: MessagesRepository, useValue: mockMessageRepository },
        AiService, // ← real AiService to hit actual models
      ],
    }).compile()

    service = module.get<DraftsService>(DraftsService)
    aiService = module.get<AiService>(AiService)
  })

  // benchmark each model
  MODELS.forEach((model) => {
    it(`should generate draft with model: ${model}`, async () => {
      // override model for this test
      jest.spyOn(aiService as any, 'getModel').mockReturnValue(model)
      // or if you have a setter:
      // aiService.model = model

      const start = Date.now()

      const result = await service.generateDraft(
        promptData.userId,
        promptData.userFirstName,
        promptData.userLastName,
        promptData.contactId,
        promptData.threadId,
        promptData.data,
      )

      const duration = Date.now() - start

      console.log(`
        ── Model: ${model} ──────────────────
        Duration:  ${duration}ms
        Content:   ${result.content.slice(0, 100)}...
        ────────────────────────────────────
      `)

      expect(result).toBeDefined()
      expect(result.content).toBeTruthy()
    }, 60_000) // ← 60s timeout for slow models
  })

  // summary after all models
  afterAll(() => {
    console.log('Benchmark complete — check logs above for timing per model')
  })
})
