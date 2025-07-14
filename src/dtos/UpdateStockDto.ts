import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStockDto {
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

  constructor(id: number, itemName: string, quantity: number, unit: string) {
    this.id = id;
    this.itemName = itemName;
    this.quantity = quantity;
    this.unit = unit;
  }
}
