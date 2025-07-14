import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserProfileDto {
  @IsNumber()
  declare id: number;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  declare username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  declare email: string;

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  declare currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  declare newPassword: string;

  constructor(currentPassword: string, newPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}
