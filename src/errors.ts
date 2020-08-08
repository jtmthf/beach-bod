import { STATUS_CODES } from 'http';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message = STATUS_CODES[statusCode],
    properties?: Record<string, unknown>,
  ) {
    super(message);
    Object.assign(this, properties);
  }
}

export function throwHttpError(
  statusCode: number,
  message?: string,
  properties?: Record<string, unknown>,
): never {
  throw new HttpError(statusCode, message, properties);
}
