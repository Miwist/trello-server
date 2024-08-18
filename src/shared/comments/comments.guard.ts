import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommentsService } from './comments.service';

@Injectable()
export class CanEditCommentGuard implements CanActivate {
  constructor(private commentService: CommentsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToHttp().getRequest();
    const commentId = data.params.commentId ?? data.body.commentId;
    const userId = data.params.userId ?? data.body.userId;

    return this.commentService
      .findCommentWithUser(commentId)
      .then((comment) => {
        if (comment) {
          if (comment.user && parseFloat(userId) === comment.user.id) {
            return true;
          } else {
            return false;
          }
        } else {
          throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
        }
      });
  }
}
