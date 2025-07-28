import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserBasicDto } from './UserBasicDto';
import { Type } from 'class-transformer';
import { NotificationDto } from './NotificationDto';

export class ProjectDataDto {
  @IsNumber()
  declare id: number;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  notifications: NotificationDto[];

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
    notifications?: NotificationDto[],
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
    this.notifications = notifications ?? [];
  }
}
