import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';



export class UpdateProjectDto{

    @IsString()
    @IsNotEmpty({message: "Name is requiered"})
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
    @IsNumber()
    declare projectId: number;


    constructor(name:string, description: string, category:string, image:string,duedate:string, projectId:number){
        
        
        this.name = name;
        this.description = description;
        this.category = category;
        this.image = image;
        this.duedate = duedate;
        this.projectId = projectId
    }
}

