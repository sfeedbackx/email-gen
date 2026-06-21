import { ResponseMeta } from '@common/pagination';
import { TransformShape } from '@common/types';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class TransformInterceptor<T extends object>
  implements NestInterceptor<T, TransformShape<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<TransformShape<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode ?? 200;

    return next.handle().pipe(
      map((res): TransformShape<T> => {
        if (!isObject(res)) {
          return { data: res as T, statusCode };
        }

        // Already in standard format — pass through
        if ('statusCode' in res && 'data' in res) {
          return {
            data: res.data as T,
            statusCode: (res.statusCode as number) ?? statusCode,
            message: res.message as string | undefined,
          };
        }

        // Pagination format
        if (typeof res === 'object' && 'items' in res && 'meta' in res) {
          return {
            items: res.items as T[],
            meta: res.meta as ResponseMeta,
            statusCode,
            message: res.message as string | undefined,
          };
        }

        // Message only response
        if ('message' in res && Object.keys(res).length === 1) {
          return {
            statusCode,
            message: res.message as string,
          };
        }

        // Default standard format
        return { data: res as T, statusCode };
      }),
    );
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
