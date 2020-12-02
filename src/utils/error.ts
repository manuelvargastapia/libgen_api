export enum ErrorCode {
  BadRequest = 400,
  NotFound = 404,
  Timeout = 408,
  Unavailable = 503,
  InternalError = 500
}

export class APIError extends Error {
  message: string;
  status: ErrorCode;

  constructor(
    message: string = 'internal server error',
    status: ErrorCode = ErrorCode.InternalError
  ) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
