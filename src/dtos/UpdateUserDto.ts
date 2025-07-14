import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}
