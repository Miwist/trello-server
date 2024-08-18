import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/utils/entities/comment.entity';
import { CardEntity } from 'src/utils/entities/card.entity';
import { CommentsValid } from './commentsValid';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async findOneCard(userId: number, cardId: number): Promise<CardEntity> {
    return this.cardsRepository.findOneBy({
      user: {
        id: userId,
      },
      id: cardId,
    });
  }

  async findCommentById(id: number): Promise<CommentEntity> {
    try {
      return this.commentsRepository.findOneBy({
        id: id,
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Error getting comment', HttpStatus.BAD_REQUEST);
    }
  }

  async findCommentWithUser(id: number): Promise<CardEntity> {
    return this.cardsRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async findAll(userId: number, cardId: number): Promise<CommentEntity[]> {
    try {
      return this.commentsRepository.find({
        where: {
          user: {
            id: userId,
          },
          card: {
            id: cardId,
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Error getting comments', HttpStatus.BAD_REQUEST);
    }
  }

  async createNewComment(
    createCommentDto: CommentsValid,
  ): Promise<CommentEntity> {
    try {
      const userId = createCommentDto.userId;
      const cardId = createCommentDto.cardId;
      const isCard = await this.findOneCard(userId, cardId);

      if (!isCard) {
        throw new BadRequestException('Card not found');
      } else {
        const user = { id: userId };
        const card = { id: cardId };

        const comment = this.commentsRepository.create({
          ...createCommentDto,
          user,
          card,
        });

        return await this.commentsRepository.save(comment);
      }
    } catch (e) {
      throw new HttpException('Error creating comment', HttpStatus.BAD_REQUEST);
    }
  }

  async updateComment(updateCommentDto: CommentEntity): Promise<CommentEntity> {
    try {
      const comment = await this.findCommentById(updateCommentDto.card.id);

      if (!comment) {
        throw new NotFoundException('Comment not found');
      } else {
        Object.assign(comment, updateCommentDto);

        return await this.commentsRepository.save(comment);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Error updating comment', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteComment(
    id: number,
    userId: number,
    cardId: number,
  ): Promise<string> {
    try {
      await this.commentsRepository.delete({
        id,
        user: { id: userId },
        card: { id: cardId },
      });
      return `Comment with ID ${id} success delete`;
    } catch (e) {
      throw new HttpException('Error deleting comment', HttpStatus.BAD_REQUEST);
    }
  }
}
