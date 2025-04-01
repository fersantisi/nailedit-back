import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
    'testing',
    'postgres',
    'admin',
    {
    host: 'localhost',
    dialect: 'postgres'
    }
)