import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  constructor(
    taskId: number,
    goalId: number,
    name: string,
    description: string,
    label: string,
    dueDate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
    this.id = taskId;
    this.goalId = goalId;
    this.name = name;
    this.description = description;
    this.label = label;
    this.dueDate = dueDate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
