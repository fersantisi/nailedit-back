import express from 'express';
import { Request } from 'express';
import cors from 'cors';
import mainRouter from './routes/main.routes';
import cookieParser from "cookie-parser"


const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser())

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(options));

app.use('/', mainRouter);

export default app;