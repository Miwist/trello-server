import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersAuthValid, UsersCreateValid } from './usersValid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async findOne(id: any): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: UsersCreateValid): Promise<UsersEntity> {
    console.log(createUserDto.password);

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
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async authUser(authuserDto: UsersAuthValid): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(authuserDto.email);

    if (user) {
      const isValidPassword = await bcrypt.compare(
        authuserDto.password,
        user.password,
      );
      if (isValidPassword) {
        // Генерируем JWT-токен
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        // Сохраняем токен в БД
        user.token = accessToken;
        await this.usersRepository.save(user);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Incorrect password');
      }
    } else {
      throw new UnauthorizedException('Incorrect email');
    }
  }
}
