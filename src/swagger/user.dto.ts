import { ApiProperty } from '@nestjs/swagger';

export class UserBase {
  @ApiProperty({ description: 'User email', nullable: true })
  email: string;

  @ApiProperty({ description: 'User password', nullable: true })
  password: string;
}

export class User extends UserBase {
  @ApiProperty({ description: 'User jwt token', nullable: true })
  token: string;

  @ApiProperty({ description: 'User ID', nullable: false })
  id: number;
}

export class UserCreate extends UserBase {
  @ApiProperty({ description: 'User name', nullable: true })
  name: string;
}

export class UserAuth extends UserBase {}