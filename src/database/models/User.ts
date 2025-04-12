import {Optional} from "sequelize"
import { Table, Column, DataType, Model, HasMany, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';
import Proyect from "./Proyect"

interface UserAttributes { 
    id: string
    name: string
    email: string
    password: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
    timestamps: false,
    tableName: "users",
    modelName: "User"
})
class User extends Model<UserAttributes,UserCreationAttributes> {
  

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;
 

  @Column({
    type: DataType.STRING,
  })
  declare name: string; 

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

  
}

export default User