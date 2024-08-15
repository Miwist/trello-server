import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async findOne(id: any): Promise<UsersEntity> {
    console.log(id);
    
    return this.userRepository.findOne(id);
  }

  async findAll(): Promise<UsersEntity[]> { 
    return this.userRepository.find(); 
  }
}
