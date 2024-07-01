import 'module-alias/register';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv-flow';
import authRouter from '@lambo/routes/auth';
import userRouter from '@lambo/routes/users';
import { swaggerDocs } from '@lambo/routes/swagger';
import session from 'express-session';
import { initPassport } from './utils/auth';

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.use(session({
  secret: process.env.APP_SECRET || 'secret',
}));

initPassport(app);

app.get('/', (req: Request, res: Response) => {
  res.send(`<h1>It's work!!!</h1>`);
});

app.use('/', authRouter);

app.use('/user', userRouter
  // #swagger.tags = ['Users']
);

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
  swaggerDocs(app, port);
});
