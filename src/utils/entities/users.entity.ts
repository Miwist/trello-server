import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { CardEntity } from './card.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  token: string;

  @OneToMany(() => ColumnEntity, (column) => column.id)
  columns: ColumnEntity[];

  @OneToMany(() => CardEntity, (card) => card.id)
  cards: CardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.id)
  comments: CommentEntity[];
}
