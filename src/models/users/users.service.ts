import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/utils/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersValid } from './usersValid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async findOne(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async createNewUser(createUserDto: UsersValid): Promise<UsersEntity> {
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

  async authUser(
    authuserDto: UsersValid,
  ): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(authuserDto.email);

    if (user) {
      const isValidPassword = await bcrypt.compare(
        authuserDto.password,
        user.password,
      );
      if (isValidPassword) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

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
