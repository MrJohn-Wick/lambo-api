import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user';
import bodyParser from 'body-parser';


dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req: Request, res:Response) => {
  res.send("<h1>It's work!!!</h1>");
});

app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});
