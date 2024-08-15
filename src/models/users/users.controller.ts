import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class getAllUsers {
    
  constructor(private readonly usersService: UsersService) {}

  @Get()
  
  async findAll(): Promise<UsersEntity[] | void> {

    const users = await this.usersService.findAll();
    if (!users) {
      throw new NotFoundException(`Users not found`);
    }
    return users;

  }
}

@Controller('user')
export class getUserForId {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UsersEntity> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
