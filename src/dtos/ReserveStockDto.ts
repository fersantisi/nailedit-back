import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReserveStockDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    stockId: number;

    @IsNumber()
    @IsNotEmpty()
    projectId: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;



    constructor(
        id: number,
        stockID: number,
        projectId: number,
        quantity: number,
    ) {
        this.id = id;
        this.stockId = stockID;
        this.projectId = projectId;
        this.quantity = quantity;
    }
}