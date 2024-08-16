import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { CardsService } from './cards.service';
import { createCard, deleteCard, getAllCards, getCardById } from './cards.controller';
import { CardEntity } from 'src/utils/entities/card.entity';
import { ColumnEntity } from 'src/utils/entities/column.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CardEntity]),
    TypeOrmModule.forFeature([ColumnEntity]),
  ],
  controllers: [getAllCards, getCardById, createCard, deleteCard],
  providers: [CardsService],
})
export class CardsModule {}
