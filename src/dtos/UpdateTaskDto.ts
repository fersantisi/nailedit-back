import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
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
  @IsNumber()
  declare taskId: number;

  constructor(
    name: string,
    description: string,
    label: string,
    dueDate: string,
    taskId: number,
  ) {
    this.name = name;
    this.description = description;
    this.label = label;
    this.dueDate = dueDate;
    this.taskId = taskId;
  }
}
