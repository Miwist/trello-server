import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  validate,
} from 'class-validator';

export class UsersCreateValid {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}


export class UsersAuthValid {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype === UsersCreateValid) {
      const object = plainToInstance(UsersCreateValid, value);
      const errors = await validate(object);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return object;
    }

    return value;
  }
}

@Injectable()
export class UserAuthPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype === UsersAuthValid) {
      const object = plainToInstance(UsersAuthValid, value);
      const errors = await validate(object);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return object;
    }

    return value;
  }
}
