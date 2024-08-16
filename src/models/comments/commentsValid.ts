import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CommentsValid {
  @IsString()
  @MinLength(3)
  @MaxLength(156)
  content: string;

  @IsNumber()
  @MaxLength(10)
  userId: number;

  @IsNumber()
  @MaxLength(10)
  cardId: number;

  @IsNumber()
  @MaxLength(10)
  columnId: number;

  @IsNumber()
  @MaxLength(10)
  id: number;
}

@Injectable()
export class CommentPipe implements PipeTransform {
  async transform(value: CommentsValid, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    const object = new metatype();

    const { content, userId, cardId, id, columnId } = value;

    if (!content) {
      throw new BadRequestException('Content requiered');
    } else if (content && content.length < 3) {
      throw new BadRequestException('Content must be at least 3 characters long');
    } else if (content && content.length > 156) {
      throw new BadRequestException(
        'Content must be at most 156 characters long',
      );
    }

    if (!userId) {
      throw new BadRequestException('User ID requiered');
    }

    if (!columnId) {
      throw new BadRequestException('Column ID requiered');
    }

    object.content = content;
    object.userId = userId;
    object.cardId = cardId;
    object.id = id;

    return object;
  }
}
