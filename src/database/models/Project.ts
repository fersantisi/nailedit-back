import {INTEGER, Optional} from "sequelize"
import { Table, Column, DataType, Model, HasMany, PrimaryKey, AutoIncrement, Unique, ForeignKey, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import User from "./User"

@Table({
  timestamps: true,
  tableName: 'projects',
  modelName: 'Project',
})
class Proyect extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userid: number;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
  })
  declare category: string;

  @Column({
    type: DataType.STRING,
  })
  declare image: string;

  @Column({
    type: DataType.STRING,
  })
  declare duedate: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(()=>User)
  declare user: User;
}



export default Proyect