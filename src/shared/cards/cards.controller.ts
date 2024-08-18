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
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CardPipe, CardValid } from './cardsValid';
import { CardsService } from './cards.service';
import { CardEntity } from 'src/utils/entities/card.entity';
import { CardBase, CardId } from 'src/swagger/cards.dto';
import { CanEditCardGuard } from './cards.guard';

@ApiTags('Get cards')
@Controller('users')
export class getAllCards {
  constructor(private readonly cardsService: CardsService) {}

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
    const cards = await this.cardsService.findAll(userId, columnId);

    if (!cards) {
      throw new NotFoundException(`Cards with user ID ${userId} not found`);
    }
    return cards;
  }
}

@ApiTags('Get card')
@Controller('users')
export class getCardById {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':userId/columns/:columnId/cards/:cardId')
  @UseGuards(CanEditCardGuard)
  @ApiOperation({
    summary: 'Get cards with specified ID',
  })
  async findAll(
    @Param('cardId') cardId: number,
  ): Promise<CardEntity | void> {
    
    const card = await this.cardsService.findCardById(cardId);

    if (!card) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }
    return card;
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
  async update(@Body() createCardDto: CardValid): Promise<CardEntity> {
    return this.cardsService.createNewCard(createCardDto);
  }
}

@ApiTags('Update card')
@Controller('users')
@UsePipes(new CardPipe())
export class updateCard {
  constructor(private readonly cardsService: CardsService) {}
  @Patch('/columns/cards')
  @UseGuards(CanEditCardGuard)
  @ApiOperation({
    summary: 'Update Card with specified ID ',
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
  async create(@Body() updateCardDto: CardEntity): Promise<CardEntity> {
    return this.cardsService.updateCard(updateCardDto);
  }
}

@ApiTags('Delete card')
@Controller('users')
export class deleteCard {
  constructor(private readonly cardsService: CardsService) {}
  @Delete(':userId/columns/:coulmnId/cards/:cardId')
  @UseGuards(CanEditCardGuard)
  @ApiOperation({ summary: 'Delete Card with user ID and specified ID' })
  @ApiBody({
    type: CardId,
    description: 'Card data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async delete(
    @Param('cardId') id: number,
  ): Promise<string> {
    return this.cardsService.deleteCard(id);
  }
}
