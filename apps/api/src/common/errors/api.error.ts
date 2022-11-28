import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorData {
  code: string;
  showToUser: boolean;
  meta?: unknown;
}

const DEFAULT_ERROR_DATA: ErrorData = {
  code: 'unknown',
  showToUser: true,
};

export class ApiError extends HttpException {
  constructor(message: string, data?: Partial<ErrorData>) {
    super({ ...DEFAULT_ERROR_DATA, ...data, message }, HttpStatus.BAD_REQUEST);
  }
}
