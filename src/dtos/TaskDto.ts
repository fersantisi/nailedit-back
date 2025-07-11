import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDto {
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
  declare goalId: number;

  constructor(
    name: string,
    description: string,
    label: string,
    dueDate: string,
    goalId: number,
  ) {
    this.name = name;
    this.description = description;
    this.label = label;
    this.dueDate = dueDate;
    this.goalId = goalId;
  }
}
