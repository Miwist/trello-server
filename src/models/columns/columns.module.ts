import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { ColumnsService } from './columns.service';
import {
  createColumn,
  deleteColumn,
  getAllColumns,
  getColumnsById,
} from './columns.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ColumnEntity]),
  ],
  controllers: [getAllColumns, getColumnsById, createColumn, deleteColumn],
  providers: [ColumnsService],
})
export class ColumnModule {}
