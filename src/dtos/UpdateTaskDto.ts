import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
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
  @ValidateIf((o) => o.dueDate !== undefined && o.dueDate !== '')
  @IsDateString({}, { message: 'Due date must be a valid date string' })
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
