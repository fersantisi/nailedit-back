import express from 'express';
import { Request } from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes'

const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(usersRoutes)

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/fruits', (req: Request, res) => {
  res.json({ fruits: ['apple', 'banana', 'orange'] });
});

export default app;