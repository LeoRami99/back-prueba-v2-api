import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
  path: string;
  method: string;
  timestamp: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any)?.message ??
          (exception as any)?.message ??
          'Internal server error';

    const details =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any)?.details ??
          (exceptionResponse as any)?.error ??
          undefined
        : undefined;

    const errorName = isHttpException
      ? (exception as HttpException).name
      : 'InternalServerError';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${message}`,
        (exception as Error)?.stack,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} -> ${status} ${message}`,
      );
    }

    const payload: ErrorResponse = {
      statusCode: status,
      message,
      error: errorName,
      details,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(payload);
  }
}
