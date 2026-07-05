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
    const prompt = this.buildGeneratePrompt(data);

    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });

      return response.message.content;
    } catch (error) {
      this.logger.error('Ollama generate failed', error);
      throw new InternalServerErrorException('AI generation failed');
    }
  }

  async refineEmail(data: RefineEmailType): Promise<string> {
    const prompt = this.buildRefinePrompt(data);

    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
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

  private buildGeneratePrompt(data: GenerateEmailType): string {
    const { contact, thread, messages, prompt, documents } = data;

    const langInstruction =
      contact.language === 'fr' ? 'Write the email in French.' : 'Write the email in English.';

    const contextBlock = contact.context ? `Contact context: ${contact.context}` : '';

    const docsBlock =
      documents && documents.length > 0
        ? `Referenced documents:\n${documents.map((d) => `- ${d.filename}${d.description ? `: ${d.description}` : ''}`).join('\n')}`
        : '';

    const historyBlock =
      messages.length > 0
        ? `Previous conversation:\n${messages.map((m) => `[${m.role === 'ME' ? 'Me' : contact.name}]: ${m.content}`).join('\n\n')}`
        : 'No previous messages.';

    return `
You are an email writing assistant.

${langInstruction}

Contact: ${contact.name}${contact.email ? ` <${contact.email}>` : ''}
${contextBlock}

Subject: ${thread.subject}

${docsBlock}

${historyBlock}

User instruction: ${prompt}

Write only the email body. No subject line. No explanation. Just the email.
    `.trim();
  }

  private buildRefinePrompt(data: RefineEmailType): string {
    return `
You are an email writing assistant.

Here is an existing email draft:
${data.content}

User instruction: ${data.prompt}

Rewrite the email based on the instruction. Write only the email body. No explanation.
    `.trim();
  }
}
