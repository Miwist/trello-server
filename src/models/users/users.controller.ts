import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpStatus,
  UsePipes,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserAuthPipe,
  UserPipe,
  UsersAuthValid,
  UsersCreateValid,
} from './usersValid';
import { User, UserCreate, UserAuth } from 'src/swagger/userDto';

@ApiTags('users')
@Controller('users')
@UsePipes(new UserPipe())
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

@ApiTags('user')
@Controller('user')
export class getUserForId {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user with specified id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findOne(@Param('id') id: string): Promise<UsersEntity> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}

@ApiTags('Create user')
@Controller('auth/register')
@UsePipes(new UserPipe())
export class createUser {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: UserCreate,
    description: 'User data',
  })

  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async create(@Body() createUserDto: UsersCreateValid): Promise<User> {

    return this.usersService.create(createUserDto);
  }
}

@ApiTags('Auth user')
@Controller('auth/login')
@UsePipes(new UserAuthPipe())
export class authUser {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({
    type: UserAuth,
    description: 'User data',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async authUser(@Body() authUserDto: UsersAuthValid): Promise<{ accessToken: string }> {

    return this.usersService.authUser(authUserDto); 
  }
}