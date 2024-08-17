import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommentsService } from './comments.service';

@Injectable()
export class CanEditCommentGuard implements CanActivate {
  constructor(private commentService: CommentsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const commentId = context.switchToHttp().getRequest().params.columnId;
    const userId = +context.switchToHttp().getRequest().params.userId;

    return this.commentService.findCommentById(commentId).then((comment) => {
      if (comment && comment.user && userId === comment.user.id) {
        return true;
      } else {
        return false;
      }
    });
  }
}
