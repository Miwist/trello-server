import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpStatus,
  UsePipes,
  Post,
  Body,
} from '@nestjs/common';
import { UsersEntity } from 'src/utils/entities/users.entity';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserPipe,
  UsersValid,
} from './usersValid';
import { User, UserCreate, UserAuth } from 'src/swagger/user.dto';

@ApiTags('Get all users')
@Controller('users')
@UsePipes(new UserPipe())
export class getAllUsers {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: [User] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findAll(): Promise<UsersEntity[] | void> {
    const users = await this.usersService.findAll();
    if (!users) {
      throw new NotFoundException(`Users not found`);
    }
    return users;
  }
}

@ApiTags('Get user')
@Controller('users')
export class getUserById {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user with specified ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findOne(@Param('id') id: number): Promise<UsersEntity> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}

@ApiTags('Create user')
@Controller('auth')
@UsePipes(new UserPipe())
export class createUser {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Create user with user data' })
  @ApiBody({
    type: UserCreate,
    description: 'User data',
  })

  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async create(@Body() createUserDto: UsersValid): Promise<User> {
    return this.usersService.createNewUser(createUserDto);
  }
}

@ApiTags('Auth user')
@Controller('auth')
export class authUser {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Auth user with email and password' })
  @ApiBody({
    type: UserAuth,
    description: 'User data',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async authUser(@Body() authUserDto: UsersValid): Promise<{ accessToken: string } | void> {

    return this.usersService.authUser(authUserDto); 
  }
}