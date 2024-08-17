import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/utils/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersValid } from './usersValid';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOne(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async createNewUser(createUserDto: UsersValid): Promise<UsersEntity> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (e) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }

  async authUser(
    authuserDto: UsersValid,
  ): Promise<{ accessToken: string } | void> {
    try {
      const user = await this.findByEmail(authuserDto.email);
      if (user) {
        const isValidPassword = await bcrypt.compare(
          authuserDto.password,
          user.password,
        );
        if (isValidPassword) {
          const payload = { userId: user.id, email: user.email };
          const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
          });

          user.token = accessToken;
          
          await this.usersRepository.save(user);
          return { accessToken };
        } else {
          throw new UnauthorizedException('Incorrect password');
        }
      } else {
        throw new UnauthorizedException('Incorrect email');
      }
    } catch (e) {
      throw new HttpException(
        'Error authorization user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
