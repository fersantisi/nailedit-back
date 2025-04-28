import {IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;

  constructor(name: string, password: string) {
    this.username = name;
    this.password = password;
  }
}