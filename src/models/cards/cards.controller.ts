import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpStatus,
  UsePipes,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CardPipe, CardValid } from './cardsValid';
import { CardsService } from './cards.service';
import { CardEntity } from 'src/utils/entities/card.entity';
import { CardBase, CardId } from 'src/swagger/cardsDto';

@ApiTags('Get cards with user ID')
@Controller('users')
export class getAllCards {
  constructor(private readonly columnsService: CardsService) {}

  @Get(':userId/columns/:columnId/cards/')
  @ApiOperation({ summary: 'Get cards with user ID and specified ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CardBase,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findAll(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
  ): Promise<CardEntity[] | void> {
    const columns = await this.columnsService.findAll(userId, columnId);

    if (!columns) {
      throw new NotFoundException(`Columns with user ID ${userId} not found`);
    }
    return columns;
  }
}

@ApiTags('Get card with user ID and column ID and specified ID')
@Controller('users')
export class getCardById {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':userId/columns/:columnId/cards/:cardId')
  async findAll(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ): Promise<CardEntity[] | void> {
    const columns = await this.cardsService.findOne(userId, columnId, cardId);

    if (!columns) {
      throw new NotFoundException(`Columns with user ID ${userId} not found`);
    }
    return columns;
  }
}

@ApiTags('Create card')
@Controller('users')
@UsePipes(new CardPipe())
export class createCard {
  constructor(private readonly cardsService: CardsService) {}
  @Post('/columns/cards')
  @ApiOperation({
    summary: 'Create Card with user ID and column ID and specified ID ',
  })
  @ApiBody({
    type: CardBase,
    description: 'Card data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CardBase,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async create(@Body() createColumnDto: CardValid): Promise<CardEntity> {
    return this.cardsService.createNewCard(createColumnDto);
  }
}

@ApiTags('Delete card')
@Controller('users')
export class deleteCard {
  constructor(private readonly cardsService: CardsService) {}
  @Delete(':userId/columns/:coulmnId/cards/:cardId')
  @ApiOperation({ summary: 'Delete Column with user ID and specified ID' })
  @ApiBody({
    type: CardId,
    description: 'Column data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async delete(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id: number,
  ): Promise<string> {
    return this.cardsService.deleteCard(userId, id, columnId);
  }
}
