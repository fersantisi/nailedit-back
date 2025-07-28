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

export class TaskDataDto {
  @IsNumber()
  declare id: number;

  @IsNumber()
  declare goalId: number;

  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsOptional()
  @IsString()
  declare description: string;

  @IsOptional()
  @IsString()
  declare label: string;

  @IsOptional()
  @IsDateString()
  declare dueDate: string;

  @IsNotEmpty()
  @IsDateString()
  declare creationDate: Date;

  @IsNotEmpty()
  @IsDate()
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
    taskId: number,
    goalId: number,
    name: string,
    description: string,
    label: string,
    dueDate: string,
    creationDate: Date,
    updatedDate: Date,
    completed: boolean,
    notifications?: NotificationDto[],
  ) {
    this.id = taskId;
    this.goalId = goalId;
    this.name = name;
    this.description = description;
    this.label = label;
    this.dueDate = dueDate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
    this.completed = completed;
    this.notifications = notifications ?? [];
  }
}
