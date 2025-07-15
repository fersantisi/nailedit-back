import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UserBasicDto {
  @IsNumber()
  declare id: number;

  @IsString()
  @IsNotEmpty()
  declare username: string;

  @IsString()
  @IsNotEmpty()
  declare email: string;

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
