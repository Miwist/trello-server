import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { ColumnBaseWithId } from 'src/swagger/columnsDto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnsRepository: Repository<ColumnEntity>,
  ) {}

  async findOne(userId: number, columnId: number): Promise<ColumnEntity[]> {
    return this.columnsRepository.find({
      where: {
        user: {
          id: userId,
        },
        id: columnId,
      },
    });
  }

  async findOneById(userId: number): Promise<ColumnEntity> {
    return this.columnsRepository.findOneBy({
      user: {
        id: userId,
      },
    });
  }

  async findAll(userId: number): Promise<ColumnEntity[]> {
    return this.columnsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createNewColumn(
    createColumnDto: ColumnBaseWithId,
  ): Promise<ColumnEntity> {
    const userId = createColumnDto.userId;

    const user = await this.findOneById(userId);

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
  }

  async deleteColumn(userId:number, id: number): Promise<string> {
    await this.columnsRepository.delete({ id, user: {id: userId} });
    return `Column with ID ${id} success delete`;
  }
}
