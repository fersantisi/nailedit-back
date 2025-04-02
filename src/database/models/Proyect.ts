import {Optional} from "sequelize"
import { Table, Column, DataType, Model, HasMany, PrimaryKey, AutoIncrement, Unique, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from "./User"

@Table({
    timestamps: true,
    tableName: "proyects",
    modelName: "Proyect"
})

class Proyect extends Model{

    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
    })
    declare id: number;

    @ForeignKey( () => User)
    @Column({
        type: DataType.INTEGER
    })
    declare user_id: number;

    @Column({
        type: DataType.STRING,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
    })
    declare description: string;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    
}



export default Proyect