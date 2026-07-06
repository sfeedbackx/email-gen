import { MessageSingleResponseDto } from '@modules/messages/dto/messages.dto';
import { UserWithPermissions } from '@modules/users/dto/users.dto';
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
import { DraftsService } from './drafts.service';
import {
  DraftListResponseDto,
  DraftParamDto,
  DraftSingleResponseDto,
  DraftThreatDto,
  GenerateDraftDto,
  UpdateDraftDto,
} from './dto/drafts.dto';

@Controller('contacts/:contactId/threads/:threadId/drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Get()
  @ZodSerializerDto(DraftListResponseDto)
  async getDrafts(@Req() req: { user: UserWithPermissions }, @Param() param: DraftThreatDto) {
    const data = await this.draftsService.getDrafts(req.user.id, param.contactId, param.threadId);
    return { data, statusCode: HttpStatus.OK };
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(DraftSingleResponseDto)
  async generateDraft(
    @Req() req: { user: UserWithPermissions },
    @Param() param: DraftThreatDto,
    @Body() body: GenerateDraftDto,
  ) {
    const data = await this.draftsService.generateDraft(
      req.user.id,
      req.user.firstName,
      req.user.lastName,
      param.contactId,
      param.threadId,
      body,
    );
    return { data, statusCode: HttpStatus.CREATED };
  }

  @Patch(':id')
  @ZodSerializerDto(DraftSingleResponseDto)
  async updateDraft(
    @Req() req: { user: UserWithPermissions },
    @Param() param: DraftParamDto,
    @Body() body: UpdateDraftDto,
  ) {
    const data = await this.draftsService.updateDraft(
      req.user.id,
      param.contactId,
      param.threadId,
      param.id,
      body,
    );
    return { data, statusCode: HttpStatus.OK };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(DraftSingleResponseDto)
  async deleteDraft(@Req() req: { user: UserWithPermissions }, @Param() param: DraftParamDto) {
    const data = await this.draftsService.deleteDraft(
      req.user.id,
      param.contactId,
      param.threadId,
      param.id,
    );
    return { data, statusCode: HttpStatus.OK };
  }

  @Post(':id/promote')
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(MessageSingleResponseDto)
  async promoteDraft(@Req() req: { user: UserWithPermissions }, @Param() param: DraftParamDto) {
    const data = await this.draftsService.promoteDraft(
      req.user.id,
      param.contactId,
      param.threadId,
      param.id,
    );
    return { data, statusCode: HttpStatus.CREATED };
  }
}
