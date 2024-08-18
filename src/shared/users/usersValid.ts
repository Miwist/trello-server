import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UsersValid {
  @IsEmail()
  @MaxLength(25)
  email: string;

  @IsString()
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}


@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: UsersValid, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    const object = new metatype();

    const { email, password, name } = value;

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!email) {
      throw new BadRequestException('Email requiered');
    } else if (!validateEmail(email)) {
      throw new BadRequestException('Incorrect email');
    } else if (email && email.length < 3) {
      throw new BadRequestException('Email must be at least 3 characters long');
    } else if (email && email.length > 20) {
      throw new BadRequestException('Email must be at most 20 characters long');
    }

    if (!password) {
      throw new BadRequestException('Password requiered');
    } else if (password && password.length < 6) {
      throw new BadRequestException('Password must be at least 6 digits long');
    } else if (password && password.length > 20) {
      throw new BadRequestException('Password must be at most 20 digits long');
    }

    if (name && name.length < 6) {
      throw new BadRequestException('Name must be at least 6 characters long');
    } else if (name && name.length > 20) {
      throw new BadRequestException('Name must be at most 20 characters long');
    }

    object.name = name;
    object.password = password;
    object.email = email;

    return object;
  }
}

