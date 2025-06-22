import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  constructor(
    goalId: number,
    name: string,
    description: string,
    dueDate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
    this.id = goalId;
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
