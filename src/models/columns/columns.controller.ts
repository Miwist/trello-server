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
import { ColumnsService } from './columns.service';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { ColumnPipe } from './columnsValid';
import { ColumnBase, ColumnBaseWithId, ColumnId } from 'src/swagger/columnsDto';

@ApiTags('Get columns with user ID')
@Controller('users')
export class getAllColumns {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get(':userId/columns/')
  @ApiOperation({ summary: 'Get column with specified ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ColumnBaseWithId,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findAll(
    @Param('userId') userId: number,
  ): Promise<ColumnEntity[] | void> {
    if (!userId) {
      throw new NotFoundException(`User ID not found`);
    } else {
      const columns = await this.columnsService.findAll(userId);

      if (!columns) {
        throw new NotFoundException(`Columns with user ID ${userId} not found`);
      }
      return columns;
    }
  }
}

@ApiTags('Get column with specified ID')
@Controller('users')
export class getColumnsById {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get(':userId/columns/:columnId')
  async findAll(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
  ): Promise<ColumnEntity[] | void> {
    const columns = await this.columnsService.findOne(userId, columnId);

    if (!columns) {
      throw new NotFoundException(`Columns with user ID ${userId} not found`);
    }
    return columns;
  }
}

@ApiTags('Create column')
@Controller('users')
@UsePipes(new ColumnPipe())
export class createColumn {
  constructor(private readonly columnsService: ColumnsService) {}
  @Post('/columns/')
  @ApiOperation({ summary: 'Create Column with user ID' })
  @ApiBody({
    type: ColumnBase,
    description: 'Column data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ColumnBaseWithId,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async create(
    @Body() createColumnDto: ColumnBaseWithId,
  ): Promise<ColumnEntity> {
    return this.columnsService.createNewColumn(createColumnDto);
  }
}

@ApiTags('Delete column')
@Controller('users')
export class deleteColumn {
  constructor(private readonly columnsService: ColumnsService) {}
  @Delete(':userId/columns/:columnId')
  @ApiOperation({ summary: 'Delete Column with user ID and specified ID' })
  @ApiBody({
    type: ColumnId,
    description: 'Column data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async delete(
    @Param('userId') userId: number,
    @Param('columnId') id: number,
  ): Promise<string> {
    return this.columnsService.deleteColumn(userId, id);
  }
}
