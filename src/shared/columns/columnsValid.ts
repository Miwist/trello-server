import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ColumnBaseWithId } from 'src/swagger/columns.dto';

export class ColumnValid {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsNumber()
  @MaxLength(10)
  userId: number;

  @IsNumber()
  @MaxLength(10)
  columnId: number;
}

@Injectable()
export class ColumnPipe implements PipeTransform {
  async transform(
    value: ColumnBaseWithId,
    metadata: ArgumentMetadata,
  ) {
    const { metatype } = metadata;

    const object = new metatype();

    const { title, userId, columnId } = value;

    if (!title) {
      throw new BadRequestException('Title requiered');
    } else if (title && title.length < 3) {
      throw new BadRequestException('Title must be at least 3 characters long');
    } else if (title && title.length > 20) {
      throw new BadRequestException('Title must be at most 20 characters long');
    }

    if (!userId) {
      throw new BadRequestException('User ID requiered');
    } 

    object.title = title;
    object.userId = userId;
    object.columnId = columnId;

    return object;
  }
}
