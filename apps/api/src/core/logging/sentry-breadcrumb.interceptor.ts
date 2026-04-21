import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { type Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SentryHttpBreadcrumbInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<{ method?: string; url?: string }>();
    const start = Date.now();
    return next.handle().pipe(
      tap({
        next: () => {
          const res = http.getResponse<{ statusCode?: number }>();
          Sentry.addBreadcrumb({
            category: 'http',
            type: 'http',
            level: 'info',
            message: `${req.method ?? '?'} ${req.url ?? '?'}`,
            data: {
              statusCode: res.statusCode,
              durationMs: Date.now() - start,
            },
          });
        },
      }),
    );
  }
}
