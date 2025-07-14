import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Project from './Project';
import Stock from './Stock';

@Table({
  timestamps: false,
  tableName: 'reservedstock',
  modelName: 'ReservedStock',
})
class ReservedStock extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Stock)
  @Column({
    type: DataType.INTEGER,
  })
  declare stockId: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
  })
  declare projectId: number;

  @Column({
    type: DataType.DOUBLE,
  })
  declare quantity: number;

  @BelongsTo(()=>Stock, {
    onDelete: 'CASCADE',
  })
  declare stock: Stock;

  @BelongsTo(()=>Project,{})
  declare project: Project;
}



export default ReservedStock