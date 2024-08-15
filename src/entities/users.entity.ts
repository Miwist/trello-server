import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { CardEntity } from './card.entity';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @OneToMany(() => ColumnEntity, (column) => column.user)
  columns: ColumnEntity[];

  @OneToMany(() => CardEntity, (card) => card.user)
  cards: CardEntity[];
}
