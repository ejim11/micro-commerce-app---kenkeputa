import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * database connection exception
 */
export class DatabaseConnectionException extends HttpException {
  /**
   * constructor for the database connection exception
   * @param operation
   */
  constructor(operation?: string) {
    super(
      {
        message:
          'Unable to process your request at the moment, please try later',
        description: 'Error connecting to the database',
        operation,
        errorCode: 'ERR_DB_CONNECTION',
      },
      HttpStatus.REQUEST_TIMEOUT,
    );
  }
}

/**
 * validation exception
 */
export class ValidationException extends HttpException {
  /**
   * constructor for the validation exception
   * @param errors
   */
  constructor(errors: string[]) {
    super(
      {
        message: 'Validation failed',
        errors,
        errorCode: 'ERR_VALIDATION',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
