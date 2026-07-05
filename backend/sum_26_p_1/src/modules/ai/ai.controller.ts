import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { AiService } from './ai.service';
import {
  AiResponseWrapperDto,
  AiStatusResponseWrapperDto,
  GenerateEmailDto,
  RefineEmailDto,
} from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(AiResponseWrapperDto)
  async generate(@Body() body: GenerateEmailDto) {
    const content = await this.aiService.generateEmail(body);
    return { data: { content }, statusCode: HttpStatus.OK };
  }

  @Post('refine')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(AiResponseWrapperDto)
  async refine(@Body() body: RefineEmailDto) {
    const content = await this.aiService.refineEmail(body);
    return { data: { content }, statusCode: HttpStatus.OK };
  }

  @Get('status')
  @ZodSerializerDto(AiStatusResponseWrapperDto)
  async status() {
    const data = await this.aiService.checkStatus();
    return { data, statusCode: HttpStatus.OK };
  }
}
