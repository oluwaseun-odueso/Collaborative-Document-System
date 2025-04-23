import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: this.getMessage(context),
          data,
        };
      }),
    );
  }

  private getMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    switch (method) {
      case 'POST':
        return 'Resource created successfully';
      case 'GET':
        return 'Request successful';
      case 'PATCH':
      case 'PUT':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Request successful';
    }
  }
}
