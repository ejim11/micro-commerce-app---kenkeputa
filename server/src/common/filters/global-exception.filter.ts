import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

/**
 * error response interface
 */
export interface ErrorResponse {
  /**
   * status code
   */
  statusCode: number;
  /**
   * timestamp
   */
  timestamp: string;
  /**
   * controller path
   */
  path: string;
  /**
   * controller method name
   */
  method: string;
  /**
   * controller name
   */
  controller: string;
  /**
   * handler name
   */
  handler: string;
  /**
   * error type
   */
  errorType: string;
  /**
   * error code
   */
  errorCode: string;
  /**
   * error message
   */
  message: string;
  /**
   * error details
   */
  details?: any;
}

/**
 * global exception filter
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * logger
   */
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * catch function
   * @param exception
   * @param host
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract controller and handler info from request
    const controller = this.getControllerName(request);

    console.log('controller: ', controller);
    const handler = this.getHandlerName(request);

    const errorResponse = this.buildErrorResponse(
      exception,
      request,
      controller,
      handler,
    );

    // Log the error with full context
    this.logger.error(
      `${errorResponse.errorType} in ${controller}::${handler}`,
      {
        ...errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * builds the error response
   * @param exception
   * @param request
   * @param controller
   * @param handler
   * @returns error response
   */
  private buildErrorResponse(
    exception: unknown,
    request: Request,
    controller: string,
    handler: string,
  ): ErrorResponse {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType = 'InternalServerError';
    let errorCode = 'ERR_INTERNAL';
    let details: any;

    // Handle different error types
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorType = exception.constructor.name;
      errorCode = this.getHttpErrorCode(status);
      details = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      errorType = 'DatabaseError';
      errorCode = 'ERR_DB_QUERY_FAILED';
      details = this.sanitizeDatabaseError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Requested resource not found';
      errorType = 'EntityNotFoundError';
      errorCode = 'ERR_ENTITY_NOT_FOUND';
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid entity data provided';
      errorType = 'EntityValidationError';
      errorCode = 'ERR_ENTITY_VALIDATION';
    } else if (exception instanceof Error) {
      message = exception.message;
      errorType = exception.constructor.name;
      errorCode = 'ERR_UNKNOWN';
    }

    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      controller,
      handler,
      errorType,
      errorCode,
      message,
      details,
    };
  }

  /**
   * function for getting the controller name where the error originated from
   * @param request
   * @returns controller name
   */
  private getControllerName(request: Request): string {
    // Extract controller from route path or use reflection metadata
    const route = request.route?.path || request.url;

    const pathSegments = route.split('/').filter(Boolean);

    if (pathSegments.length > 0) {
      return `${pathSegments[2].charAt(0).toUpperCase()}${pathSegments[2].slice(1)}Controller`;
    }

    return 'UnknownController';
  }

  /**
   * function for getting the handler name of the handler function where the error originated from
   * @param request
   * @returns the handler name
   */
  private getHandlerName(request: Request): string {
    const method = request.method.toLowerCase();
    const pathSegments = request.url.split('/').filter(Boolean);

    if (pathSegments.length > 1) {
      return `${method}${pathSegments[pathSegments.length - 1].charAt(0).toUpperCase()}${pathSegments[pathSegments.length - 1].slice(1)}`;
    }

    return `${method}Handler`;
  }

  /**
   * function for getting the http error code
   * @param status
   * @returns  http error code
   */
  private getHttpErrorCode(status: number): string {
    const statusCodes = {
      400: 'ERR_BAD_REQUEST',
      401: 'ERR_UNAUTHORIZED',
      403: 'ERR_FORBIDDEN',
      404: 'ERR_NOT_FOUND',
      409: 'ERR_CONFLICT',
      422: 'ERR_VALIDATION',
      429: 'ERR_RATE_LIMIT',
      500: 'ERR_INTERNAL',
      502: 'ERR_BAD_GATEWAY',
      503: 'ERR_SERVICE_UNAVAILABLE',
      504: 'ERR_GATEWAY_TIMEOUT',
    };

    return statusCodes[status] || 'ERR_UNKNOWN_HTTP';
  }

  /**
   * function for sanitizing the db error
   * @param error
   * @returns db error object
   */
  private sanitizeDatabaseError(error: QueryFailedError): any {
    // Remove sensitive information from database errors
    return {
      code: (error as any).code,
      constraint: (error as any).constraint,
      table: (error as any).table,
      column: (error as any).column,
      // Don't expose raw SQL or sensitive details
    };
  }
}
