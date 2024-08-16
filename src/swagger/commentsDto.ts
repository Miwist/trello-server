import { ApiProperty } from '@nestjs/swagger';

export class CommentBase {
  @ApiProperty({ description: 'Comment content', nullable: true })
  content: string;

  @ApiProperty({ description: 'User ID', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Comment ID', nullable: false })
  commentId: number;

  @ApiProperty({ description: 'Column ID', nullable: false })
  columnId: number;

  @ApiProperty({ description: 'Card ID', nullable: false })
  cardId: number;
}
