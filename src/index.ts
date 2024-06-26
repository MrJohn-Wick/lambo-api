import 'module-alias/register';
import express, { Express, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import userRouter from '@lambo/routes/users';
import { swaggerDocs } from '@lambo/routes/swagger';

dotenvFlow.config();

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use('/user', userRouter
  // #swagger.tags = ['Users']
);

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
  swaggerDocs(app, port);
});
