import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { CommentEntity } from 'src/utils/entities/comment.entity';
import { CommentsService } from './comments.service';
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
} from './comments.controller';
import { CardEntity } from 'src/utils/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CommentEntity]),
    TypeOrmModule.forFeature([CardEntity]),
  ],
  controllers: [getAllComments, getCommentById, createComment, deleteComment],
  providers: [CommentsService],
})
export class CommentsModule {}
