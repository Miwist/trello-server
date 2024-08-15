import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CardEntity } from './card.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => CardEntity, (card) => card.comments)
  card: CardEntity;
}
