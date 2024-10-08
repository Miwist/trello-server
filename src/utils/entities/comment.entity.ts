import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CardEntity } from './card.entity';
import { UsersEntity } from './users.entity';
import { ColumnEntity } from './column.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => CardEntity, (card) => card.id)
  card: CardEntity;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: CardEntity;
}
