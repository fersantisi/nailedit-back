import { IsNotEmpty, IsNumber } from 'class-validator';

export class StockItemDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    itemName: string;

    @IsNotEmpty()
    unit: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    reserved: number;

    constructor(
        id: number,
        itemName: string,
        unit: string,
        quantity: number,
        reserved: number,
    ) {
        this.id = id;
        this.itemName = itemName;
        this.unit = unit;
        this.quantity = quantity;
        this.reserved = reserved;
    }
}

export class ReserveStockWithItemDto {
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

    stockItem: StockItemDto;

    constructor(
        id: number,
        stockId: number,
        projectId: number,
        quantity: number,
        stockItem: StockItemDto,
    ) {
        this.id = id;
        this.stockId = stockId;
        this.projectId = projectId;
        this.quantity = quantity;
        this.stockItem = stockItem;
    }
} 