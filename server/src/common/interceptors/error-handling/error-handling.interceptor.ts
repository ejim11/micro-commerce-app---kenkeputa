import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { DatabaseConnectionException } from 'src/common/filters/common-exceptions.filter';
import { QueryFailedError } from 'typeorm';

/**
 * interceptor for handling error
 */
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  /**
   * intercept function
   * @param context
   * @param next
   * @returns
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(30000), // 30 second timeout
      catchError((error) => {
        // Handle specific database errors
        if (error instanceof QueryFailedError) {
          if (this.isConnectionError(error)) {
            return throwError(() => new DatabaseConnectionException());
          }
        }

        if (error instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                'Request timeout - please try again later',
              ),
          );
        }

        // Re-throw the original error to be handled by global filter
        return throwError(() => error);
      }),
    );
  }

  /**
   * function for checking whether it is a connection error
   * @param error
   * @returns boolean for whether it is a connection error
   */
  private isConnectionError(error: QueryFailedError): boolean {
    const connectionErrorCodes = [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNRESET',
      'connection refused',
      'connect timeout',
    ];

    const errorMessage = error.message.toLowerCase();
    return connectionErrorCodes.some((code) =>
      errorMessage.includes(code.toLowerCase()),
    );
  }
}
