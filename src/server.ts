console.log("Starting server script...");

import app from './app';
import config from './config/config';
import { sequelize } from './database/database';


console.log("Starting server script...");

async function main(): Promise<void> {
  
  try {
    await sequelize.authenticate()
    console.log('Connection has been stablished')

    app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Link: http://localhost:${config.port}`);
  });


  } catch (error) {
    
    console.log('unable to connect to the database')
  }



}

main();