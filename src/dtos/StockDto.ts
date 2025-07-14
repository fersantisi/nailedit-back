import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StockDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    itemName: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsNumber()
    @IsNotEmpty()
    reserved: number;

    @IsNumber()
    @IsNotEmpty()
    userid: number;

    constructor(
        id: number,
        itemName: string,
        quantity: number,
        unit: string,
        reserved: number,
        userid: number
    ) {
        this.id = id;
        this.itemName = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.reserved = reserved;
        this.userid = userid;
    }
}