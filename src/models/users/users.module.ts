import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { getAllUsers, getUserForId } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { UsersEntity } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([UsersEntity])],
  controllers: [getAllUsers, getUserForId],
  providers: [ UsersService],
})
export class UsersModule {}