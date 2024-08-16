import { BadRequestException, Injectable } from '@nestjs/common';
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
  ): Promise<CardEntity[]> {
    return this.cardsRepository.find({
      where: {
        user: {
          id: userId,
        },
        column: {
          id: columnId,
        },
        id: cardId,
      },
    });
  }

  async findOneColumn(
    userId: number,
    columnId: number,
  ): Promise<ColumnEntity> {
    return this.columnsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: columnId,
      },
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
  }

  async deleteCard(
    userId: number,
    columnId: number,
    id: number,
  ): Promise<string> {
    await this.cardsRepository.delete({
      id,
      user: { id: userId },
      column: { id: columnId },
    });
    return `Card with ID ${id} success delete`;
  }
}
