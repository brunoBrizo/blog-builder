import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';
import { ZodValidationException } from 'nestjs-zod';
import * as Sentry from '@sentry/nestjs';

import { ErrorCode } from './error-codes';

export type ApiErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
};

function statusToCode(status: number): ErrorCode {
  if (status === HttpStatus.UNAUTHORIZED) return ErrorCode.UNAUTHORIZED;
  if (status === HttpStatus.FORBIDDEN) return ErrorCode.FORBIDDEN;
  if (status === HttpStatus.NOT_FOUND) return ErrorCode.NOT_FOUND;
  if (status === HttpStatus.CONFLICT) return ErrorCode.CONFLICT;
  if (status === HttpStatus.TOO_MANY_REQUESTS)
    return ErrorCode.TOO_MANY_REQUESTS;
  if (status === HttpStatus.SERVICE_UNAVAILABLE)
    return ErrorCode.SERVICE_UNAVAILABLE;
  if (status >= 500) return ErrorCode.INTERNAL;
  return ErrorCode.BAD_REQUEST;
}

function zodIssues(err: ZodError): unknown {
  return err.issues.map((i) => ({
    path: i.path,
    message: i.message,
    code: i.code,
  }));
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<{ method?: string; url?: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL;
    let message = 'Internal server error';
    let details: unknown;

    if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      code = ErrorCode.BAD_REQUEST;
      const inner = exception.getZodError();
      message = 'Validation failed';
      details = inner instanceof ZodError ? zodIssues(inner) : String(inner);
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = ErrorCode.BAD_REQUEST;
      message = 'Validation failed';
      details = zodIssues(exception);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = statusToCode(status);
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object' && 'message' in body) {
        const m = (body as { message?: string | string[] }).message;
        message = Array.isArray(m) ? m.join(', ') : (m ?? exception.message);
      } else {
        message = exception.message;
      }
      if (status >= 500) {
        Sentry.captureException(exception);
      }
    } else if (exception instanceof Error) {
      message = 'Internal server error';
      this.logger.error(
        `${req.method} ${req.url} — ${exception.message}`,
        exception.stack,
      );
      Sentry.captureException(exception);
    } else {
      this.logger.error(`Unknown exception: ${String(exception)}`);
      Sentry.captureException(exception);
    }

    if (status >= 500 && !(exception instanceof HttpException)) {
      Sentry.captureException(
        exception instanceof Error ? exception : new Error(String(exception)),
      );
    }

    const payload: ApiErrorBody = {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    };

    res.status(status).json(payload);
  }
}
