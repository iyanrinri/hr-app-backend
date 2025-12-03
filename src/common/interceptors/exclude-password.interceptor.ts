import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.removePassword(data);
      }),
    );
  }

  private removePassword(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.removePassword(item));
    }

    if (typeof data === 'object') {
      const { password, ...rest } = data;
      const cleaned: any = { ...rest };

      // Recursively clean nested objects
      for (const key in cleaned) {
        if (cleaned[key] && typeof cleaned[key] === 'object') {
          cleaned[key] = this.removePassword(cleaned[key]);
        }
      }

      return cleaned;
    }

    return data;
  }
}
