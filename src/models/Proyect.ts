import { DataType, DataTypes } from 'sequelize'
import {sequelize} from '../database/database'


export const Proyect = sequelize.define('proyects',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
})