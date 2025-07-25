import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsOptional()
  @IsString()
  declare description: string;

  @IsOptional()
  @ValidateIf((o) => o.dueDate !== undefined && o.dueDate !== '')
  @IsDateString({}, { message: 'Due date must be a valid date string' })
  declare dueDate: string;

  @IsNotEmpty()
  @IsNumber()
  declare goalId: number;

  constructor(
    name: string,
    description: string,
    dueDate: string,
    goalId: number,
  ) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.goalId = goalId;
  }
}
