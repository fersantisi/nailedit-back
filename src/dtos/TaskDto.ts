import {IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';



export class TaskDto{

    @IsString()
    @IsNotEmpty({message: "Name is requiered"})
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
    @IsNumber()
    declare goalId: number;


    constructor(name:string, description: string, label:string,duedate:string, goalId:number){
        
        
        this.name = name;
        this.description = description;
        this.label = label;
        this.duedate = duedate;
        this.goalId = goalId
    }
}