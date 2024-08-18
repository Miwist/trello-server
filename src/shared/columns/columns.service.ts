import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { ColumnBaseWithId } from 'src/swagger/columns.dto';
import { UsersEntity } from 'src/utils/entities/users.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnsRepository: Repository<ColumnEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOne(userId: number, columnId: number): Promise<ColumnEntity> {
    try {
      return this.columnsRepository.findOneBy({
        user: {
          id: userId,
        },
        id: columnId,
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Error getting one column', HttpStatus.BAD_REQUEST);
    }
  }

  async findColumnById(columnId: number): Promise<ColumnEntity> {
    return await this.columnsRepository.findOneBy({
      id: columnId,
    });
  }

  async findColumnWithUser(columnId: number): Promise<ColumnEntity> {
    return await this.columnsRepository.findOne({
      where: { id: columnId },
      relations: ['user'],
    });
  }

  async findUserById(userId: number): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({
      id: userId,
    });
  }

  async findAll(userId: number): Promise<ColumnEntity[]> {
    try {
      return this.columnsRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Error getting columns', HttpStatus.BAD_REQUEST);
    }
  }

  async createNewColumn(
    createColumnDto: ColumnBaseWithId,
  ): Promise<ColumnEntity> {
    try {
      const userId = createColumnDto.userId;

      const user = await this.findUserById(userId);

      if (!user) {
        throw new BadRequestException('User not found');
      } else {
        const user = { id: userId };
        const column = this.columnsRepository.create({
          ...createColumnDto,
          user,
        });

        return await this.columnsRepository.save(column);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Error creating column', HttpStatus.BAD_REQUEST);
    }
  }

  async updateColumn(updateColumnDto: ColumnBaseWithId): Promise<ColumnEntity> {
    try {
      const column = await this.findColumnById(updateColumnDto.columnId);

      if (!column) {
        throw new NotFoundException('Column not found');
      }

      Object.assign(column, updateColumnDto);

      return await this.columnsRepository.save(column);
    } catch (e) {
      console.log(e);
      throw new HttpException('Error updating column', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteColumn(userId: number, id: number): Promise<string> {
    try {
      await this.columnsRepository.delete({ id, user: { id: userId } });
      return `Column with ID ${id} success delete`;
    } catch (e) {
      console.log(e);
      throw new HttpException('Error deleting column', HttpStatus.BAD_REQUEST);
    }
  }
}
