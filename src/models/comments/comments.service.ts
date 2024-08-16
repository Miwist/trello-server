import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/utils/entities/comment.entity';
import { CardEntity } from 'src/utils/entities/card.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async findOne(
    userId: number,
    columnId: number,
    cardId: number,
    id: number,
  ): Promise<CommentEntity[]> {
    return this.commentsRepository.find({
      where: {
        user: {
          id: userId,
        },
        card: {
          id: cardId,
        },
        column: {
            id: columnId
        },
        id: id,
      },
    });
  }

  async findOneCard(userId: number, cardId: number): Promise<CardEntity> {
    return this.cardsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: cardId,
      },
    });
  }

  async findAll(userId: number, columnId: number, cardId: number): Promise<CommentEntity[]> {
    return this.commentsRepository.find({
      where: {
        user: {
          id: userId,
        },
        column: {
            id: columnId
        },
        card: {
            id: cardId
        }
      },
    });
  }

  async createNewComment(
    createCommentDto: CommentEntity,
  ): Promise<CommentEntity> {
    const userId = createCommentDto.user.id;
    const cardId = createCommentDto.card.id;

    const isCard = await this.findOneCard(userId, cardId);

    if (!isCard) {
      throw new BadRequestException('Card not found');
    } else {
      const user = { id: userId };
      const card = { id: cardId };

      const comment = this.commentsRepository.create({
        ...createCommentDto,
        user,
        card
      });

      return await this.commentsRepository.save(comment);
    }
  }

  async deleteComment(
    id: number,
    userId: number,
    cardId: number,
    columnId: number,
  ): Promise<string> {
    await this.commentsRepository.delete({
      id,
      user: { id: userId },
      card: { id: cardId },
      column: { id: columnId },
    });
    return `Comment with ID ${id} success delete`;
  }
}
