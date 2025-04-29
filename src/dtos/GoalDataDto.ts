import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GoalDataDto {
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
  @IsDateString()
  declare creationDate: Date;

  @IsNotEmpty()
  @IsDateString()
  declare updatedDate: Date;

  constructor(
    name: string,
    description: string,
    duedate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
    this.name = name;
    this.description = description;
    this.duedate = duedate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
