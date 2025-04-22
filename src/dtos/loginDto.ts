import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}