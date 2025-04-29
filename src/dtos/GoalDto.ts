import {
    IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GoalDto {

    @IsString()
    @IsNotEmpty({message: "Name is requiered"})
    declare name: string;

    @IsOptional()
    @IsString()
    declare description: string;

    @IsOptional()
    @IsDate()
    declare duedate: string;

    @IsNotEmpty()
    @IsNumber()
    declare userId: number;


    constructor(name:string, description: string, duedate:string, userId:number){
        
        
        this.name = name;
        this.description = description;
        this.duedate = duedate;
        this.userId = userId
    }
}
