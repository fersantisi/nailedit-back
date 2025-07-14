import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import User from "./User"
import Project from './Project';
import ReservedStock from './ReservedStock';

@Table({
  timestamps: false,
  tableName: 'stock',
  modelName: 'Stock',
})
class Stock extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

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

  @Column({
    type: DataType.DOUBLE,
  })
  declare reserved: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userid: number;

  @BelongsTo(()=>User, {
    onDelete: 'CASCADE',
  })
  declare project: Project;

  @HasMany(() => ReservedStock)
  declare resrvedStock: ReservedStock[];
}



export default Stock