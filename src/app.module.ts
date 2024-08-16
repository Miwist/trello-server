import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './models/users/users.module';
import { ColumnModule } from './models/columns/columns.module';
import { CardsModule } from './models/cards/cards.module';
import { CommentEntity } from './utils/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    ColumnModule,
    CardsModule,
    CommentEntity,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
