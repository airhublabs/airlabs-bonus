import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseApiExecptionResponse } from '../../types/api-exception.type';
import { Response } from 'express';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AllExecptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private logger = new Logger(AllExecptionFilter.name);

  catch(
    exception: AxiosError & { getStatus?: () => number; message?: string },
    host: ArgumentsHost
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception?.getStatus ? exception.getStatus() : 500;
    const isOperational = statusCode < 500;
    const message = exception?.message;

    const responseBody: BaseApiExecptionResponse = {
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      isOperational,
      message: message || 'Unknown exception occured.',
    };

    this.logger.error(exception);
    console.log({
      data: exception.response?.data,
      message: exception.message,
    });
    response.status(statusCode).json(responseBody);
  }
}
