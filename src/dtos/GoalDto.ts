import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class GoalDto {
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
