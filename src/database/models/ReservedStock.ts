import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from "./User"
import Project from './Project';

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

  @BelongsTo(()=>Stock, {
    onDelete: 'CASCADE',
  })

  @BelongsTo(()=>Project,{})
  

  
  declare project: Project;
}



export default Stock