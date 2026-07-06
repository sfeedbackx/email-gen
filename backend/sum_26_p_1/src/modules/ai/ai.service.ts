import { AppConfigService } from '@config/config.service';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Ollama } from 'ollama';
import { GenerateEmailType, RefineEmailType } from './dto/ai.dto';

@Injectable()
export class AiService {
  private readonly ollama: Ollama;
  private readonly model: string;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly appConfigService: AppConfigService) {
    this.ollama = new Ollama({
      host: this.appConfigService.ollamaHost,
    });
    this.model = this.appConfigService.ollamaModel;
  }

  async generateEmail(data: GenerateEmailType): Promise<string> {
    const systemMsg = this.buildSystemPrompt(data);
    const userMsg = this.buildUserPrompt(data);

    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        options: { temperature: 0.7 },
      });

      return response.message.content;
    } catch (error) {
      this.logger.error('Ollama generate failed', error);
      throw new InternalServerErrorException('AI generation failed');
    }
  }

  async refineEmail(data: RefineEmailType): Promise<string> {
    const systemMsg = this.buildRefineSystemPrompt();
    const userMsg = this.buildRefineUserPrompt(data);

    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        options: { temperature: 0.7 },
      });

      return response.message.content;
    } catch (error) {
      this.logger.error('Ollama refine failed', error);
      throw new InternalServerErrorException('AI refinement failed');
    }
  }

  async checkStatus(): Promise<{ running: boolean; model: string }> {
    try {
      await this.ollama.list();
      return { running: true, model: this.model };
    } catch {
      return { running: false, model: this.model };
    }
  }

  // ─────────────────────────────────────────────
  // PROMPT BUILDERS
  // ─────────────────────────────────────────────

  private buildSystemPrompt(data: GenerateEmailType): string {
    const langInstruction =
      data.contact.language === 'fr'
        ? 'You must write the email in French.'
        : 'You must write the email in English.';

    return `You are an expert email writing assistant. You write emails FROM the user TO a contact. The "Conversation so far" shows past messages — "Me (you)" is what the user wrote, and "[Contact Name]" is what the contact sent. You must write the next email in the user's voice, as a response to the contact. ${langInstruction}

Rules:
- Write only the email body — no subject line, no signature block, no explanation.
- Match the tone to the contact relationship (formal if context suggests formality, friendly if appropriate).
- Address the contact's message content directly — respond to their points, questions, or requests.
- Never include meta-commentary or write from the contact's perspective.
- Output plain text only — no markdown formatting.`.trim();
  }

  private buildUserPrompt(data: GenerateEmailType): string {
    const { contact, thread, messages, prompt, documents } = data;

    const contextBlock = contact.context
      ? `Style guidance: ${contact.context}`
      : '';

    const docsBlock =
      documents && documents.length > 0
        ? `Referenced documents:\n${documents.map((d) => `- ${d.filename}${d.description ? `: ${d.description}` : ''}`).join('\n')}`
        : '';

    const historyBlock =
      messages.length > 0
        ? `Conversation so far (most recent last):\n${messages.map((m) => {
            const sender = m.role === 'ME' ? 'Me (you)' : contact.name;
            return `${sender}: ${m.content}`;
          }).join('\n\n')}`
        : 'No previous messages in this thread.';

    return [
      `Write to: ${contact.name}${contact.email ? ` <${contact.email}>` : ''}`,
      `Subject: ${thread.subject}`,
      contextBlock,
      docsBlock,
      historyBlock,
      '',
      `My instruction: ${prompt}`,
    ].filter(Boolean).join('\n');
  }

  private buildRefineSystemPrompt(): string {
    return 'You are an expert email writing assistant. Revise the draft below according to the user\'s instruction. Output only the revised email body — no explanations, no subject line, no markdown.';
  }

  private buildRefineUserPrompt(data: RefineEmailType): string {
    return `Current draft:\n${data.content}\n\nRevision instruction: ${data.prompt}`;
  }
}
