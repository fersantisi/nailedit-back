import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProjectDto {
  @IsNumber()
  declare id: number;

  @IsNumber()
  declare userId: number;

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
  declare creationDate: Date | null;

  @IsNotEmpty()
  @IsDate()
  declare updatedDate: Date | null;

  constructor(
    id: number,
    userId: number,
    name: string,
    description: string,
    category: string,
    image: string,
    duedate: string,
    creationDate: Date | null,
    updatedDate: Date| null,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;
    this.duedate = duedate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
  }
}
