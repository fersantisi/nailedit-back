import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserBasicDto } from './UserBasicDto';

export class ProjectDataDto {
  @IsNumber()
  declare id: number;

  @IsString()
  @IsNotEmpty({ message: 'Name is requiered' })
  declare name: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Privacy is requiered' })
  declare privacy: boolean;

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
  declare dueDate: string;

  @IsNotEmpty()
  @IsDateString()
  declare creationDate: Date;

  @IsNotEmpty()
  @IsDate()
  declare updatedDate: Date;

  @IsNumber()
  declare userId: number;

  declare owner: UserBasicDto;

  constructor(
    id: number,
    name: string,
    description: string,
    category: string,
    image: string,
    dueDate: string,
    creationDate: Date,
    updatedDate: Date,
    userId: number,
    owner: UserBasicDto,
    privacy: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;
    this.dueDate = dueDate;
    this.creationDate = creationDate;
    this.updatedDate = updatedDate;
    this.userId = userId;
    this.owner = owner;
    this.privacy = privacy;
  }
}
