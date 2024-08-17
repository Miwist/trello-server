import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  authUser,
  createUser,
  getAllUsers,
  getUserById,
} from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { UsersEntity } from 'src/utils/entities/users.entity';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [getAllUsers, getUserById, createUser, authUser],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
