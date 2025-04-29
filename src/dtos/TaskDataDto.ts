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
  declare goalid: number;

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
    taskId: number,
    goalId: number,
    name: string,
    description: string,
    label: string,
    duedate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
    this.id = taskId;
    this.goalid = goalId;
    this.name = name;
    this.description = description;
    this.label = label;
    this.duedate = duedate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
