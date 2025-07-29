import { Optional } from 'sequelize';
import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import Proyect from './Project';
import Stock from "./Stock";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  notification_time: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Unique
  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  @Unique
  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @HasMany(() => Proyect)
  declare proyects: Proyect[];

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare created_at: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updated_at: Date;

  @HasMany(() => Stock)
  declare stocks: Stock[];

  @Column({
    type: DataType.INTEGER,
  })
  declare notification_time: number;
}

export default User;
