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

  @ManyToOne(() => ColumnEntity, (column) => column.id)
  column: ColumnEntity;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: UsersEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.id)
  comments: CommentEntity[];
}
