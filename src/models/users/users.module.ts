import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  authUser,
  createUser,
  getAllUsers,
  getUserForId,
} from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { UsersEntity } from 'src/entities/users.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  controllers: [getAllUsers, getUserForId, createUser, authUser],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
