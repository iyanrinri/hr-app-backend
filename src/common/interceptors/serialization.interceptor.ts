import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Parse and re-serialize to handle Prisma types properly
        const jsonString = JSON.stringify(data, (key, value) => {
          // Handle BigInt
          if (typeof value === 'bigint') {
            return value.toString();
          }
          
          // Handle Date
          if (value instanceof Date) {
            return value.toISOString();
          }
          
          // Handle Prisma Decimal objects
          if (value && typeof value === 'object' && 
              typeof value.s === 'number' && 
              typeof value.e === 'number' && 
              Array.isArray(value.d)) {
            return parseFloat(value.toString());
          }
          
          return value;
        });
        
        return JSON.parse(jsonString);
      }),
    );
  }
}