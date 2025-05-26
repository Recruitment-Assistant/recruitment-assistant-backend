import { SUCCESS } from '@common/constants/app.constant';
import { ResponseDataApi } from '@common/dto/general/response-data-api.dto';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  responseHandler(res: any, context: ExecutionContext): ResponseDataApi {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;
    return {
      status: SUCCESS,
      statusCode,
      data: res?.data ? res?.data : res,
      meta: res?.meta ? res?.meta : undefined,
    };
  }
}
