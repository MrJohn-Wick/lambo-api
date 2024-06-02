import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res:Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
