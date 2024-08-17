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
  updateColumn,
} from './columns.controller';
import { UsersEntity } from 'src/utils/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ColumnEntity]),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  controllers: [
    getAllColumns,
    getColumnsById,
    createColumn,
    deleteColumn,
    updateColumn,
  ],
  providers: [ColumnsService],
})
export class ColumnModule {}
