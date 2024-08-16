import { ApiProperty } from '@nestjs/swagger';

export class CardBase {
  @ApiProperty({ description: 'Card title', nullable: true })
  title: string;

  @ApiProperty({ description: 'User ID', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Column ID', nullable: false })
  columnId: number;

  @ApiProperty({ description: 'Card ID', nullable: false })
  cardId: number;
}

export class CardId {
    @ApiProperty({ description: 'Card ID', nullable: false })
    cardId: number;
}