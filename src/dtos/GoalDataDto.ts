import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { NotificationDto } from './NotificationDto';

export class GoalDataDto {
  @IsNumber()
  declare id: number;

  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsOptional()
  @IsString()
  declare description: string;

  @IsOptional()
  @IsDateString()
  declare dueDate: string;

  @IsNotEmpty()
  @IsDateString()
  declare creationDate: Date;

  @IsNotEmpty()
  @IsDateString()
  declare updatedDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  declare completed: boolean;


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  notifications: NotificationDto[];

  constructor(
    goalId: number,
    name: string,
    description: string,
    dueDate: string,
    creationDate: Date,
    updatedDate: Date,
    completed: boolean,
    notifications?: NotificationDto[]
  ) {
    this.id = goalId;
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
    this.completed = completed;
    this.notifications = notifications ?? [];
  }
}
