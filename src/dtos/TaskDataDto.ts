import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDataDto {


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
  declare duedate: string;

  @IsNotEmpty()
  @IsDateString()
  declare creationDate: Date;

  @IsNotEmpty()
  @IsDate()
  declare updatedDate: Date;

  constructor(
    name: string,
    description: string,
    label: string,
    duedate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
   
    this.name = name;
    this.description = description;
    this.label = label;
    this.duedate = duedate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
