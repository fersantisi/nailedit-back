import express from 'express';
import { Request } from 'express';
import cors from 'cors';
import mainRouter from './routes/mainRouter';
import usersRoutes from './routes/users.routes'
import loginRoutes from './routes/login.routes'
import cookieParser from "cookie-parser"


const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser())

app.use(usersRoutes)
app.use(loginRoutes)


const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/fruits', (req: Request, res) => {
  res.json({ fruits: ['apple', 'banana', 'orange'] });
});

app.use('/', mainRouter);

export default app;