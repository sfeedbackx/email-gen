import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ThreadsService } from './threads.service';
import {
  CreateThreadDto,
  UpdateThreadDto,
  ThreadParamDto,
  ThreadListResponseDto,
  ThreadSingleResponseDto,
  ThreadWithDetailsResponseWrapperDto,
  ContactParamDto,
} from './dto/threads.dto';
import { UserWithPermissions } from '@modules/users/dto/users.dto';

@Controller('contacts/:contactId/threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) { }

  @Get()
  @ZodSerializerDto(ThreadListResponseDto)
  async getThreads(@Req() req: { user: UserWithPermissions }, @Param() param: ThreadParamDto) {
    return await this.threadsService.getThreads(req.user.id, param.contactId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(ThreadSingleResponseDto)
  async createThread(
    @Req() req: { user: UserWithPermissions },
    @Param() param: ContactParamDto,
    @Body() body: CreateThreadDto,
  ) {
    const data = await this.threadsService.createThread(req.user.id, param.contactId, body);
    return { data, statusCode: HttpStatus.CREATED };
  }

  @Get(':id')
  @ZodSerializerDto(ThreadWithDetailsResponseWrapperDto)
  async getThread(@Req() req: { user: UserWithPermissions }, @Param() param: ThreadParamDto) {
    return await this.threadsService.getThreadWithDetails(req.user.id, param.contactId, param.id);
  }

  @Patch(':id')
  @ZodSerializerDto(ThreadSingleResponseDto)
  async updateThread(
    @Req() req: { user: UserWithPermissions },
    @Param() param: ThreadParamDto,
    @Body() body: UpdateThreadDto,
  ) {
    return await this.threadsService.updateThread(req.user.id, param.contactId, param.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ZodSerializerDto(ThreadSingleResponseDto)
  async deleteThread(@Req() req: { user: UserWithPermissions }, @Param() param: ThreadParamDto) {
    return await this.threadsService.deleteThread(req.user.id, param.contactId, param.id);
  }
}
