import {DataTypes} from 'sequelize'
import sequelize from '../database'
import Proyect from './Proyect'

const User = sequelize.define('users',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING   
    },

    email: {
        type: DataTypes.STRING,
        unique: true
    },

    password: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

User.hasMany(Proyect,{
    foreignKey: 'proyect_id',
    sourceKey: 'id'
})

Proyect.belongsTo(User,{
    foreignKey: 'proyect_id',
    targetKey: 'id'
})

export default User