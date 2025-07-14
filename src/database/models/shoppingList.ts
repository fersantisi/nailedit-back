import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import User from "./User"
import Stock from './Stock';

@Table({
  timestamps: false,
  tableName: 'shoppinglist',
  modelName: 'ShoppingList',
})
class ShoppingList extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
  type: DataType.STRING,
  })
  declare itemid: number;

  @Column({
    type: DataType.STRING,
  })
  declare itemName: string;

  @Column({
    type: DataType.DOUBLE,
  })
  declare quantity: number;

  @Column({
    type: DataType.STRING,
  })
  declare unit: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userid: number;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
  })
  declare user: User;

  @BelongsTo(() => Stock, {
  onDelete: 'CASCADE',
  })
  declare stock: Stock;
}



export default ShoppingList