import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from './users.entity';
import { CardEntity } from './card.entity';

@Entity()
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: UsersEntity;

  @OneToMany(() => CardEntity, (card) => card.column)
  cards: CardEntity[];
}