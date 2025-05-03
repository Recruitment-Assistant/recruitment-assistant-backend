import { ICurrentUser } from '@/common/interfaces';
export interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
  execute(
    request: IRequest,
    currentUser: ICurrentUser,
  ): Promise<IResponse> | IResponse;
}
