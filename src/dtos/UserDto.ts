import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;



  constructor(name: string, email: string , password: string) {
    this.username = name;
    this.password = password;
    this.email = email;
  }
}