import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ProjectDataDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsOptional()
  @IsString()
  declare description: string;

  @IsOptional()
  @IsString()
  declare category: string;

  @IsOptional()
  @IsString()
  declare image: string;

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
    category: string,
    image: string,
    duedate: string,
    creationDate: Date,
    updatedDate: Date,
  ) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;
    this.duedate = duedate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
