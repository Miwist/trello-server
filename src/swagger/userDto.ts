import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({ description: "User name", nullable: true })
    name: string;
    
    @ApiProperty({ description: "User email", nullable: true })
    email: string;
    
    @ApiProperty({ description: "User password", nullable: true })
    password: string;

    @ApiProperty({ description: "User jwt token", nullable: true })
    token: string;
}


export class UserCreate {
    @ApiProperty({ description: "User name", nullable: true })
    name: string;
    
    @ApiProperty({ description: "User email", nullable: true })
    email: string;
    
    @ApiProperty({ description: "User password", nullable: true })
    password: string;
}

export class UserAuth {
    @ApiProperty({ description: "User email", nullable: true })
    email: string;
    
    @ApiProperty({ description: "User password", nullable: true })
    password: string;
}