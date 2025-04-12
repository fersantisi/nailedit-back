import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
    database: 'naileditDB',
    username: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    models: [__dirname + "/models"],    
})

export default sequelize;