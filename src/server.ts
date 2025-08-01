import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import config from './config/config';
import sequelize from './database/database';
import { createAdmin } from './services/users.service';

//start cron
import './jobs/email.job';

async function main(): Promise<void> {
  try {
    await sequelize.sync({ alter: false });
    createAdmin();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Link: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log('unable to connect to the database');
  }
}

main();
