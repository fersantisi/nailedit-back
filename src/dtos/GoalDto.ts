import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GoalDto {
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
  @IsNumber()
  declare projectId: number;

  constructor(
    name: string,
    description: string,
    dueDate: string,
    userId: number,
  ) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.projectId = userId;
  }
}
