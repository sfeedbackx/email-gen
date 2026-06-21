import {
  BadRequestException,
  ParseEnumPipe,
  ParseEnumPipeOptions,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';

export const IdempotencyKeyPipe = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('Invalid UUID'),
});
export const IntIdParsePipe = new ParseIntPipe({
  exceptionFactory: () => new BadRequestException('Invalid Integer'),
});

export const EnumPipe = <T extends object>(enumType: T, options?: ParseEnumPipeOptions) =>
  new ParseEnumPipe(enumType, {
    ...options,
    exceptionFactory: () => new BadRequestException('Invalid Enum'),
  });
export const ActorsIdPipe = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('invalid  Actor'),
});
