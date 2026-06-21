import { HeaderKey } from '@common/header';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetHeader = createParamDecorator((data: HeaderKey, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[data];
});
