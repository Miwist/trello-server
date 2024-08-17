import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ColumnsService } from './columns.service';

@Injectable()
export class CanEditColumnGuard implements CanActivate {
  constructor(private columnService: ColumnsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const columnId = context.switchToHttp().getRequest().params.columnId;
    const userId = +context.switchToHttp().getRequest().params.userId;

    return this.columnService.findColumnById(columnId).then((column) => {
      if (column && column.user && userId === column.user.id) {
        return true;
      } else {
        return false;
      }
    });
  }
}
