import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from 'src/utils/entities/card.entity';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { CardValid } from './cardsValid';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnsRepository: Repository<ColumnEntity>,
  ) {}

  async findOne(
    userId: number,
    cardId: number,
    columnId: number,
  ): Promise<CardEntity> {
    return this.cardsRepository.findOneBy({
      user: {
        id: userId,
      },
      column: {
        id: columnId,
      },
      id: cardId,
    });
  }

  async findOneColumn(userId: number, columnId: number): Promise<ColumnEntity> {
    return this.columnsRepository.findOneBy({
      user: {
        id: userId,
      },
      id: columnId,
    });
  }
  async findCardById(cardId: number): Promise<CardEntity> {
    return this.cardsRepository.findOne({
      where: { id: cardId },
      relations: ['user'],
    });
  }
  async findAll(userId: number, columnId: number): Promise<CardEntity[]> {
    return this.cardsRepository.find({
      where: {
        user: {
          id: userId,
        },
        column: { id: columnId },
      },
    });
  }

  async createNewCard(createCardDto: CardValid): Promise<CardEntity> {
    try {
      const userId = createCardDto.userId;
      const columnId = createCardDto.columnId;

      const isColumn = await this.findOneColumn(userId, columnId);

      if (isColumn) {
        const user = { id: userId };
        const column = { id: columnId };

        const card = this.cardsRepository.create({
          ...createCardDto,
          user,
          column,
        });

        return await this.cardsRepository.save(card);
      } else {
        throw new BadRequestException('Column not found');
      }
    } catch (e) {
      throw new HttpException('Error creating card', HttpStatus.BAD_REQUEST);
    }
  }

  async updateCard(updateCardDto: CardEntity): Promise<CardEntity> {
    try {
      const card = await this.findCardById(updateCardDto.id);

      if (!card) {
        throw new NotFoundException('Card not found');
      } else {
        Object.assign(card, updateCardDto);

        return await this.cardsRepository.save(card);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Error updating card', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCard(
    userId: number,
    columnId: number,
    id: number,
  ): Promise<string> {
    try {
      await this.cardsRepository.delete({
        id,
        user: { id: userId },
        column: { id: columnId },
      });
      return `Card with ID ${id} success delete`;
    } catch (e) {
      throw new HttpException('Error deleting card', HttpStatus.BAD_REQUEST);
    }
  }
}
