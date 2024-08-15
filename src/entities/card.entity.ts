import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { UsersEntity } from './users.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => ColumnEntity, (column) => column.cards)
  column: ColumnEntity;

  @ManyToOne(() => UsersEntity, (user) => user.cards)
  user: UsersEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.card)
  comments: CommentEntity[];
}
