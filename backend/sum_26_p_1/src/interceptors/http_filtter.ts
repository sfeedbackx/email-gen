import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodSerializationException, ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod/v4';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private resolveHttpExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse();
    const message =
      typeof response === 'object' && response !== null && 'message' in response
        ? Array.isArray(response.message)
          ? (response.message[0] as string)
          : (response.message as string)
        : exception.message;

    switch (exception.getStatus()) {
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.BAD_REQUEST:
        return message !== 'Bad Request' ? message : 'Bad Request';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return message !== 'Not Found' ? message : 'Not Found';
      case HttpStatus.CONFLICT:
        return message !== 'Conflict' ? message : 'Conflict';
      default:
        return message;
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errors: unknown = null;

    this.logger.error(exception);

    if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errors = exception.getZodError();
      this.logger.error(`ZodValidationException: ${exception.message}`);
    } else if (
      exception instanceof UnauthorizedException ||
      exception instanceof BadRequestException ||
      exception instanceof ForbiddenException ||
      exception instanceof NotFoundException ||
      exception instanceof ConflictException ||
      exception instanceof HttpException
    ) {
      status = exception.getStatus();
      message = this.resolveHttpExceptionMessage(exception);

      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'object' && errorResponse !== null && 'errors' in errorResponse) {
        errors = errorResponse.errors;
      }

      this.logger.error(`${exception.constructor.name}: ${exception.message}`);
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.message;
    } else if (exception instanceof ZodSerializationException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Response serialization failed';
      errors = exception.getZodError();
      this.logger.error(`ZodSerializationException: ${exception.message}`);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.logger.error(
        `Unhandled exception: ${exception instanceof Error ? exception.message : String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
