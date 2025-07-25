import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProjectDto {
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
  @ValidateIf((o) => o.dueDate !== undefined && o.dueDate !== '')
  @IsDateString({}, { message: 'Due date must be a valid date string' })
  declare dueDate: string;

  @IsNotEmpty()
  @IsNumber()
  declare projectId: number;

  constructor(
    name: string,
    description: string,
    category: string,
    image: string,
    dueDate: string,
    projectId: number,
  ) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;
    this.dueDate = dueDate;
    this.projectId = projectId;
  }
}
