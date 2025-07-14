import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ShoppingListItemDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    itemId: number;

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
    userid: number;

    constructor(
        id: number,
        itemId: number,
        itemName: string,
        quantity: number,
        unit: string,
        userid: number
    ) {
        this.id = id;
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.userid = userid;
    }
}