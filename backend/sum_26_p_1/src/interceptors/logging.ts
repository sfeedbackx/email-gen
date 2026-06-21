import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ZodError } from 'zod';

/**
 * Configuration options for the LoggingInterceptor
 */
export interface LoggingInterceptorOptions {
  sensitiveFields?: string[];
  maxBodySize?: number;
  logger?: LoggerService;
}

/**
 * Enhanced interceptor that logs information about incoming requests and outgoing responses.
 * Features:
 * - Safe handling of circular references with lodash.cloneDeep
 * - Configurable sensitive data redaction (including pattern matching)
 * - Consistent log levels based on HTTP status codes for both regular responses and exceptions
 * - Size management for large payloads
 * - Client IP address tracking
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;
  private readonly sensitiveFields: string[];
  private readonly maxBodySize: number;
  private readonly exactMatches: string[];
  private readonly patternMatches: { pattern: string; regex: RegExp }[];

  constructor(options: LoggingInterceptorOptions = {}) {
    this.logger = options.logger || new Logger(LoggingInterceptor.name);
    this.sensitiveFields = options.sensitiveFields || [
      'password',
      'token',
      'refreshToken',
      'secret',
      'apiKey',
      'credential',
      'auth',
      '*password*',
      '*token*',
      '*secret*',
      '*key*',
      '*auth*',
      '*credential*',
    ];
    this.maxBodySize = options.maxBodySize !== undefined ? options.maxBodySize : 10000;

    // Sort fields into exact matches and pattern matches
    this.exactMatches = [];
    this.patternMatches = [];
    this.sensitiveFields.forEach((field) => {
      if (field.includes('*')) {
        const escaped = field.replace(/[.+^${}()|[\]\\]/g, '\\$&');
        const regexPattern = escaped.replace(/\*/g, '.*').replace(/\?/g, '.');

        this.patternMatches.push({
          pattern: field,
          regex: new RegExp(`^${regexPattern}$`, 'i'),
        });
      } else {
        this.exactMatches.push(field.toLowerCase());
      }
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url, body, query, params } = request;

    const ip = this.getClientIp(request);

    // Log request
    this.logger.log(
      this.formatLogMessage(`Request: ${method} ${url} from ${ip}`, {
        body: this.processData(body),
        query: this.processData(query),
        params: this.processData(params),
      }),
    );

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const response = ctx.getResponse<Response>();
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log response with appropriate level based on status code
          const logData = {
            payload: this.processData(data),
            duration: `${duration}ms`,
          };

          this.logWithAppropriateLevel(
            `Response: ${method} ${url} ${statusCode} - ${duration}ms`,
            statusCode,
            logData,
          );
        },
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;

        // Determine the HTTP status code from the error
        const statusCode = this.getErrorStatusCode(error);
        // Create error log message
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        const errorContext = this.buildErrorContext(error);

        // Log with appropriate level based on status code
        this.logWithAppropriateLevel(
          `Error: ${method} ${url} [${statusCode}] - ${duration}ms - ${errorMessage}`,
          statusCode,
          errorContext,
          errorStack,
        );

        // Re-throw the error to let the exception filter handle it
        throw error;
      }),
    );
  }

  /**
   * Gets the HTTP status code from various error types
   */
  private getErrorStatusCode(error: unknown): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }
    if (error instanceof ZodError) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Builds a plain (English, untranslated) context object for an error,
   * pulling the response payload from HttpException when available.
   */
  private buildErrorContext(error: unknown): unknown {
    if (error instanceof HttpException) {
      return { response: error.getResponse() };
    }

    if (error instanceof ZodError) {
      return { response: { errors: error.issues } };
    }

    if (error instanceof Error) {
      return { response: { message: error.message } };
    }

    return { response: { message: String(error) } };
  }

  /**
   * Logs a message with the appropriate level based on HTTP status code
   */
  private logWithAppropriateLevel(
    message: string,
    statusCode: number,
    context?: unknown,
    stack?: string,
  ): void {
    // Format the context if it's an error with a response property (like HttpException)
    let formattedContext = context;
    if (context && typeof context === 'object' && 'response' in context) {
      const errorObj = context as { response?: unknown };

      // If response.errors is a string that looks like JSON, parse it for better readability
      if (
        errorObj.response &&
        typeof errorObj.response === 'object' &&
        'errors' in errorObj.response &&
        typeof errorObj.response.errors === 'string'
      ) {
        try {
          const errorsString = errorObj.response.errors as string;
          if (errorsString.startsWith('[') || errorsString.startsWith('{')) {
            const parsedErrors = JSON.parse(errorsString);
            errorObj.response = {
              ...errorObj.response,
              errors: parsedErrors,
            };
          }
        } catch (e) {
          // If parsing fails, keep the original string
        }
      }

      formattedContext = errorObj;
    }

    const finalMessage = this.formatLogMessage(message, formattedContext);

    if (statusCode < 400) {
      this.logger.log(finalMessage);
    } else if (statusCode < 500) {
      this.logger.warn(finalMessage);
    } else {
      this.logger.error(finalMessage, stack);
    }
  }

  private formatLogMessage(message: string, context?: unknown): string {
    if (context === undefined) {
      return message;
    }

    return `${message}\n${this.safeStringify(context, true)}`;
  }

  private safeStringify(data: unknown, pretty = false): string {
    const seen = new WeakSet<object>();

    try {
      return JSON.stringify(
        data,
        (_key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }

          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular]';
            }
            seen.add(value);
          }

          return value;
        },
        pretty ? 2 : 0,
      );
    } catch {
      return '[Unserializable]';
    }
  }

  /**
   * Processes data for logging: sanitizes sensitive information and manages size
   */
  private processData(data: unknown): unknown {
    if (!data) return data;

    // Sanitize first
    const sanitized = this.sanitizeData(data);

    // Then handle size if needed
    if (this.maxBodySize > 0 && typeof sanitized === 'object' && sanitized !== null) {
      const json = this.safeStringify(sanitized);
      if (json.length > this.maxBodySize) {
        return {
          _truncated: true,
          _originalSize: json.length,
          _preview: `${json.substring(0, this.maxBodySize)}...`,
        };
      }
    }

    return sanitized;
  }

  /**
   * Safely clones and sanitizes sensitive data from requests/responses
   */
  private sanitizeData(data: unknown): unknown {
    if (!data) return data;
    if (typeof data !== 'object') return data;

    // Create a deep copy safely (handles circular references)
    let sanitized: unknown;
    try {
      sanitized = structuredClone(data);
    } catch (e) {
      // Fallback to JSON if lodash fails
      try {
        sanitized = JSON.parse(JSON.stringify(data));
      } catch (jsonError) {
        return { _error: 'Could not serialize data for logging' };
      }
    }

    // Function to sanitize an object recursively
    const sanitizeObject = (obj: Record<string, unknown>): void => {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach((key) => {
        // Check exact matches (case insensitive)
        if (this.exactMatches.includes(key.toLowerCase())) {
          obj[key] = '***REDACTED***';
        }
        // Check pattern matches
        else if (this.patternMatches.some((pattern) => pattern.regex.test(key))) {
          obj[key] = '***REDACTED***';
        }
        // Recursive check for nested objects
        else if (obj[key] && typeof obj[key] === 'object') {
          sanitizeObject(obj[key] as Record<string, unknown>);
        }
      });
    };

    sanitizeObject(sanitized as Record<string, unknown>);
    return sanitized;
  }

  /**
   * Gets the client IP address, handling proxy scenarios
   */
  private getClientIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0].trim();
    }

    return request.ip || 'unknown';
  }
}
