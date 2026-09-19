import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import type { ServiceName, StandardErrorResponse } from '@ecommerce/shared-types';

type HttpExceptionResponse = {
  error?: string;
  message?: string | string[];
  statusCode?: number;
};

@Catch()
export class StandardHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly serviceName: ServiceName) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const body = this.createBody(statusCode, request.url, exceptionResponse);

    response.status(statusCode).json(body);
  }

  private createBody(
    statusCode: number,
    path: string,
    exceptionResponse: string | object | undefined,
  ): StandardErrorResponse {
    const details =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as HttpExceptionResponse)
        : undefined;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : details?.message ?? 'Internal server error';

    return {
      success: false,
      statusCode,
      code: details?.error ?? HttpStatus[statusCode] ?? 'Error',
      message,
      path,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
    };
  }
}
