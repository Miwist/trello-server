import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ColumnsService } from './columns.service';

@Injectable()
export class CanEditColumnGuard implements CanActivate {
  constructor(private columnService: ColumnsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToHttp().getRequest();
    const columnId = data.params.columnId ?? data.body.columnId;
    const userId = data.params.userId ?? data.body.userId;

    return this.columnService.findColumnWithUser(columnId).then((column) => {
      if (column) {
        if (column.user && parseFloat(userId) === column.user.id) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new HttpException('Column not found', HttpStatus.BAD_REQUEST);
      }
    });
  }
}
