import 'module-alias/register';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from '@lambo/routes/users';
import { swaggerDocs } from '@lambo/routes/swagger';


dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (req: Request, res:Response) => {
  res.send("<h1>It's work!!!</h1>");
});

app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
  swaggerDocs(app, port);
});
