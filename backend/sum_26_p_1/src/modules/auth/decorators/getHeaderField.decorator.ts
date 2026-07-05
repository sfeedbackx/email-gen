import { HeaderKey } from '@common/header';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetHeader = createParamDecorator((data: HeaderKey, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[data];
});
