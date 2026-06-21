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
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentParamDto,
  DocumentListResponseDto,
  DocumentSingleResponseDto,
} from './dto/documents.dto';
import { UserWithPermissions } from '@modules/users/dto/users.dto';
@Controller('contacts/:contactId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Get()
  @ZodSerializerDto(DocumentListResponseDto)
  async getDocuments(@Req() req: { user: UserWithPermissions }, @Param() param: DocumentParamDto) {
    const data = await this.documentsService.getDocuments(req.user.id, param.contactId);
    return { data, statusCode: HttpStatus.OK };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(DocumentSingleResponseDto)
  async createDocument(
    @Req() req: { user: UserWithPermissions },
    @Param() param: DocumentParamDto,
    @Body() body: CreateDocumentDto,
  ) {
    const data = await this.documentsService.createDocument(req.user.id, param.contactId, body);
    return { data, statusCode: HttpStatus.CREATED };
  }

  @Patch(':id')
  @ZodSerializerDto(DocumentSingleResponseDto)
  async updateDocument(
    @Req() req: { user: UserWithPermissions },
    @Param() param: DocumentParamDto,
    @Body() body: UpdateDocumentDto,
  ) {
    const data = await this.documentsService.updateDocument(
      req.user.id,
      param.contactId,
      param.id,
      body,
    );
    return { data, statusCode: HttpStatus.OK };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(DocumentSingleResponseDto)
  async deleteDocument(
    @Req() req: { user: UserWithPermissions },
    @Param() param: DocumentParamDto,
  ) {
    const data = await this.documentsService.deleteDocument(req.user.id, param.contactId, param.id);
    return { data, statusCode: HttpStatus.OK };
  }
}
