import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsOptional()
  @IsString()
  declare description: string;

  @IsOptional()
  @IsDateString()
  declare duedate: string;

  @IsNotEmpty()
  @IsNumber()
  declare goalId: number;

  constructor(
    name: string,
    description: string,
    duedate: string,
    goalId: number,
  ) {
    this.name = name;
    this.description = description;
    this.duedate = duedate;
    this.goalId = goalId;
  }
}
