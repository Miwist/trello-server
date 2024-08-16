import { ApiProperty } from '@nestjs/swagger';

export class ColumnBase {
  @ApiProperty({ description: 'Column title', nullable: true })
  title: string;

  @ApiProperty({ description: 'User ID', nullable: false })
  userId: number;
}

export class ColumnBaseWithId extends ColumnBase {
  @ApiProperty({ description: 'Column ID', nullable: true })
  columnId: number;
}

export class ColumnId {
  @ApiProperty({ description: 'Column ID', nullable: true })
  columnId: number;
}
