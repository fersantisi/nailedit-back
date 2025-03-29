import express from 'express';
import { Request } from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = ['http://localhost:5173'];

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