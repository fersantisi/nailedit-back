import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ProjectDto {
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
  declare userId: number;

  @IsNotEmpty()
  @IsBoolean()
  declare privacy: boolean;

  constructor(
    name: string,
    description: string,
    category: string,
    image: string,
    dueDate: string,
    userId: number,
    privacy: boolean
  ) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;
    this.dueDate = dueDate;
    this.userId = userId;
    this.privacy = privacy;
  }
}
