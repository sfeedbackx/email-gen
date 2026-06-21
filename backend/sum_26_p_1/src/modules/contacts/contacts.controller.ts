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
import { ContactsService } from './contacts.service';
import { UserWithPermissions } from '@modules/users/dto/users.dto';
import {
  ContactListResponseDto,
  ContactParamDto,
  ContactSingleResponseDto,
  ContactWithDetailsResponseWrapperDto,
  CreateContactDto,
  UpdateContactDto,
} from './dto/contacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @Get()
  @ZodSerializerDto(ContactListResponseDto)
  async getContacts(@Req() req: { user: UserWithPermissions }) {
    return await this.contactsService.getContacts(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(ContactSingleResponseDto)
  async createContact(@Req() req: { user: UserWithPermissions }, @Body() body: CreateContactDto) {
    return await this.contactsService.createContact(req.user.id, body);
  }

  @Get(':id')
  @ZodSerializerDto(ContactWithDetailsResponseWrapperDto)
  async getContact(@Req() req: { user: UserWithPermissions }, @Param() param: ContactParamDto) {
    return await this.contactsService.getContactWithDetails(req.user.id, param.id);
  }

  @Patch(':id')
  @ZodSerializerDto(ContactSingleResponseDto)
  async updateContact(
    @Req() req: { user: UserWithPermissions },
    @Param() param: ContactParamDto,
    @Body() body: UpdateContactDto,
  ) {
    return await this.contactsService.updateContact(req.user.id, param.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ZodSerializerDto(ContactSingleResponseDto)
  async deleteContact(@Req() req: { user: UserWithPermissions }, @Param() param: ContactParamDto) {
     await this.contactsService.deleteContact(req.user.id, param.id);
  }
}
