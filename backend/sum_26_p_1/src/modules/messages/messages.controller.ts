import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  MessageParamDto,
  MessageListResponseDto,
  MessageSingleResponseDto,
} from './dto/messages.dto';
import { UserWithPermissions } from '@modules/users/dto/users.dto';

@Controller('contacts/:contactId/threads/:threadId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get()
  @ZodSerializerDto(MessageListResponseDto)
  async getMessages(@Req() req: { user: UserWithPermissions }, @Param() param: MessageParamDto) {
    const data = await this.messagesService.getMessages(
      req.user.id,
      param.contactId,
      param.threadId,
    );
    return { data, statusCode: HttpStatus.OK };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(MessageSingleResponseDto)
  async createMessage(
    @Req() req: { user: UserWithPermissions },
    @Param() param: MessageParamDto,
    @Body() body: CreateMessageDto,
  ) {
    const data = await this.messagesService.createMessage(
      req.user.id,
      param.threadId,
      param.contactId,
      body,
    );
    return { data, statusCode: HttpStatus.CREATED };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageSingleResponseDto)
  async deleteMessage(@Req() req: { user: UserWithPermissions }, @Param() param: MessageParamDto) {
    const data = await this.messagesService.deleteMessage(
      req.user.id,
      param.contactId,
      param.threadId,
      param.id,
    );
    return { data, statusCode: HttpStatus.OK };
  }
}
