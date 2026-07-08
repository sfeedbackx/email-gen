
import { Test, TestingModule } from '@nestjs/testing';
import { DraftsService } from '../modules/drafts/drafts.service';
import { AiService } from '../modules/ai/ai.service';
import { DraftsRepository } from '../modules/drafts/drafts.repository';
import { ThreadsRepository } from '../modules/threads/threads.repository';
import { ContactsRepository } from '../modules/contacts/contacts.repository';
import { MessagesRepository } from '../modules/messages/messages.repository';
import { AppConfigService } from '@config/config.service';
import * as fs from 'fs/promises';
import * as path from 'path';

type BenchmarkEntry = {
  model: string
  threadContext : string
  messageLength : number
  contact: string
  contactContext: string
  threadScenario: string
  messageCount: number
  prompt: string
  durationMs: number
  content: string
  timestamp: string
}


const LOG_PATH = path.join(__dirname, 'benchmark-results.txt');
const JSON_PATH = path.join(__dirname, 'benchmark-results.json');

async function appendResult(content: string) {
  try {
    await fs.appendFile(LOG_PATH, content, { encoding: 'utf8' });
  } catch (error) {
    console.error('Error writing benchmark log:', error);
  }
}


const collectedResults: BenchmarkEntry[] = []

async function writeJsonResults() {
  let existing: BenchmarkEntry[] = []
  try {
    const raw = await fs.readFile(JSON_PATH, 'utf8')
    existing = JSON.parse(raw)
  } catch {
    // no existing file yet, that's fine
  }
  const merged = [...existing, ...collectedResults]
  await fs.writeFile(JSON_PATH, JSON.stringify(merged, null, 2), 'utf8')
}

const CONTACTS = [
  {
    id: 1,
    name: 'Sarah Mansour',
    email: 'sarah@example.com',
    context: 'Shy first-year student, hesitant to ask questions directly, easily discouraged by curt replies',
    language: 'fr',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Karim Belhadj',
    email: 'karim@example.com',
    context: 'Frustrated parent, has emailed twice before without a reply, expects a direct and prompt answer',
    language: 'fr',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Emma Johnson',
    email: 'emma@example.com',
    context: 'Confident exchange student, informal tone, prefers concise English replies',
    language: 'en',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Mohamed Trabelsi',
    email: 'mohamed@example.com',
    context: 'Anxious about a missed deadline, needs reassurance as well as practical next steps',
    language: 'fr',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// ── thread + message scenarios ───────────────────────────────────────
// Vary conversation depth. Every "USER" message below represents a
// message that was ALREADY SENT — originally generated as a draft in
// a previous turn, then promoted to a real message. We do NOT
// regenerate those here; they're fixed historical context. The AI is
// only asked to generate the NEXT draft, i.e. the reply to the final
// CONTACT message in the thread. This is what lets you judge whether
// the model actually reads/uses the thread history instead of only
// reacting to the latest message in isolation.
const THREAD_SCENARIOS = [
  {
    label: 'no-messages',
    // cold start — contact hasn't sent anything, draft generated purely
    // from prompt + contact context
    thread: { id: 1, contactId: 1, subject: 'New inquiry', createdAt: new Date(), updatedAt: new Date() },
    messages: [] as any[],
  },
  {
    label: 'one-exchange', // CONTACT -> (needs reply)
    thread: { id: 2, contactId: 2, subject: 'Question about October exam', createdAt: new Date(), updatedAt: new Date() },
    messages: [
      {
        id: 1,
        threadId: 2,
        role: 'CONTACT',
        content: "Bonjour, je n'arrive pas à trouver mon résultat pour l'examen d'octobre.",
        createdAt: new Date('2026-06-01T09:00:00Z'),
      },
    ],
  },
  {
    // CONTACT -> USER(sent) -> CONTACT -> USER(sent) -> CONTACT -> USER(sent) -> CONTACT -> (needs reply)
    label: 'three-exchanges',
    thread: { id: 3, contactId: 4, subject: 'Missed deadline', createdAt: new Date(), updatedAt: new Date() },
    messages: [
      {
        id: 1,
        threadId: 3,
        role: 'CONTACT',
        content: "Bonjour, j'ai raté la date limite pour rendre mon dossier, que puis-je faire ?",
        createdAt: new Date('2026-06-01T09:00:00Z'),
      },
      {
        id: 2,
        threadId: 3,
        role: 'USER', // previously-generated draft, already sent
        content: 'Bonjour, pouvez-vous me donner la raison du retard ?',
        createdAt: new Date('2026-06-01T10:00:00Z'),
      },
      {
        id: 3,
        threadId: 3,
        role: 'CONTACT',
        content: "J'étais malade la semaine dernière, j'ai un certificat médical.",
        createdAt: new Date('2026-06-01T11:00:00Z'),
      },
      {
        id: 4,
        threadId: 3,
        role: 'USER', // previously-generated draft, already sent
        content: 'Merci, pouvez-vous nous envoyer une copie du certificat médical ?',
        createdAt: new Date('2026-06-01T12:00:00Z'),
      },
      {
        id: 5,
        threadId: 3,
        role: 'CONTACT',
        content: "Oui, je vous envoie ça demain matin. Est-ce que je risque d'être pénalisé sur ma note ?",
        createdAt: new Date('2026-06-01T13:00:00Z'),
      },
      {
        id: 6,
        threadId: 3,
        role: 'USER', // previously-generated draft, already sent
        content: "C'est noté, merci. Une fois le certificat reçu, nous confirmerons s'il y a une pénalité ou non.",
        createdAt: new Date('2026-06-01T14:00:00Z'),
      },
      {
        id: 7,
        threadId: 3,
        role: 'CONTACT',
        content: 'Bonjour, voici mon certificat en pièce jointe. Merci de me confirmer la suite.',
        createdAt: new Date('2026-06-02T08:00:00Z'),
      },
    ],
  },
]

// ── prompts ───────────────────────────────────────────────────────────
const PROMPTS = [
  'Reply politely about exam results',
  'Reply firmly but respectfully, this is the third follow-up email',
  'Reassure the student and explain the next steps clearly',
  'Keep it short and casual',
]

// ── benchmark scenario matrix ────────────────────────────────────────
// Each scenario pairs a contact + thread scenario + prompt.
// Add/remove entries here to shape what gets benchmarked —
// a full cross-product of everything above may be overkill/slow.
const SCENARIOS = [
  { contact: CONTACTS[0], threadScenario: THREAD_SCENARIOS[0], prompt: PROMPTS[0] }, // shy student, cold start
  { contact: CONTACTS[1], threadScenario: THREAD_SCENARIOS[1], prompt: PROMPTS[1] }, // frustrated parent, 1 msg
  { contact: CONTACTS[2], threadScenario: THREAD_SCENARIOS[0], prompt: PROMPTS[3] }, // confident student, casual
  { contact: CONTACTS[3], threadScenario: THREAD_SCENARIOS[2], prompt: PROMPTS[2] }, // anxious student, 4-msg thread
]




// ── benchmark ──────────────────────────────────────────────────────
const MODELS = ['qwen2.5', 'mistral', 'llama3.1'] // ← add your models here



describe('DraftsService - Model Benchmark', () => {
  let service: DraftsService

  const buildModule = async (contact: any, thread: any, messages: any[], model: string) => {
    const mockContactRepository = {
      findById: jest.fn().mockResolvedValue([contact]),
    }
    const mockThreadRepository = {
      findById: jest.fn().mockResolvedValue([thread]),
    }
    const mockMessageRepository = {
      findAllByThreadId: jest.fn().mockResolvedValue(messages),
    }
    const mockDraftRepository = {
      // IMPORTANT: echo back what the service actually generated,
      // instead of returning a static object — otherwise you're
      // benchmarking the mock, not the model.
      createDraft: jest.fn().mockImplementation((data: any) =>
        Promise.resolve({
          id: 1,
          threadId: thread.id,
          content: data?.content ?? data?.data?.content ?? JSON.stringify(data),
          prompt: data?.prompt ?? '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      findAllByThreadId: jest.fn().mockResolvedValue([]),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftsService,
        { provide: DraftsRepository, useValue: mockDraftRepository },
        { provide: ThreadsRepository, useValue: mockThreadRepository },
        { provide: ContactsRepository, useValue: mockContactRepository },
        { provide: MessagesRepository, useValue: mockMessageRepository },
        AiService, // real AiService — hits the actual model
        {
          provide: AppConfigService,
          useValue: {
            ollamaHost: 'http://localhost:11434',
            ollamaModel: `${model}`,
          },
        },
      ],
    }).compile()

    return module.get<DraftsService>(DraftsService)
  }

  // benchmark each model
  MODELS.forEach((model) => {
    SCENARIOS.forEach(({ contact, threadScenario, prompt }) => {
      const testLabel = `${model} | ${contact.name} (${contact.context.split(',')[0]}) | ${threadScenario.label} | "${prompt}"`

      it(`should generate draft — ${testLabel}`, async () => {
        service = await buildModule(contact, threadScenario.thread, threadScenario.messages, model)

        const start = Date.now()

        const result = await service.generateDraft(
          contact.userId,
          'Ahmed',
          'Benali',
          contact.id,
          threadScenario.thread.id,
          { prompt },
        )

        const duration = Date.now() - start

        const report = `
── ${testLabel} ──
Messages in thread: ${threadScenario.messages.length}
Thread Subject : ${threadScenario.thread.subject}
Duration:  ${duration}ms
Word Count : ${result.content.trim().length}
${result.content}
────────────────────────────────────
`
        console.log(report)
        await appendResult(report)

        collectedResults.push({
          model,
          messageLength  : result.content.trim().length,
          threadContext : threadScenario.thread.subject,
          contact: contact.name,
          contactContext: contact.context,
          threadScenario: threadScenario.label,
          messageCount: threadScenario.messages.length,
          prompt,
          durationMs: duration,
          content: result.content,
          timestamp: new Date().toISOString(),
        })

        // We only assert that generation didn't fail/error out and
        // produced *something* — judging whether it's a GOOD response
        // for the persona/thread is done manually by comparing
        // benchmark-results.json across scenarios, not asserted here.
        expect(result).toBeDefined()
        expect(result.content).toBeTruthy()
      }, 60_000)
    })
  })

  afterAll(async () => {
    await writeJsonResults()
    console.log('Benchmark complete — see benchmark-results.txt (readable) and benchmark-results.json (structured, for comparison)')
  })
})
