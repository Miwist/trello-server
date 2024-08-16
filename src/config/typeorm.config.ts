import { TypeOrmModuleOptions} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CardEntity } from 'src/utils/entities/card.entity';
import { ColumnEntity } from 'src/utils/entities/column.entity';
import { UsersEntity } from 'src/utils/entities/users.entity';
import { CommentEntity } from 'src/utils/entities/comment.entity';

ConfigModule.forRoot();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [UsersEntity, ColumnEntity, CardEntity, CommentEntity],
  synchronize: true,
};





